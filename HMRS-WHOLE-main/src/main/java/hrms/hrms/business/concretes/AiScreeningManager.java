package hrms.hrms.business.concretes;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import hrms.hrms.business.abstracts.AiScreeningService;
import hrms.hrms.business.abstracts.ChatService;
import hrms.hrms.business.abstracts.JobApplicationService;
import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.request.SendMessageRequest;
import hrms.hrms.dto.request.UpdateApplicationStatusRequest;
import hrms.hrms.entity.JobApplicationStatus;

@Service
public class AiScreeningManager implements AiScreeningService {

    private static final int MIN_AI_SCREENING_QUESTIONS = 5;
    private static final String HANDOFF_TAG = "[HANDOFF: RECRUITER]";
    private static final int MAX_MESSAGES_IN_PROMPT = 24;
    private static final int MAX_PROMPT_CHARS = 12_000;
    private static final int MAX_CHARS_PER_MESSAGE = 1_200;

    private final ChatService chatService;
    private final JobApplicationService applicationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RestTemplate restTemplate;
    private final String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    private static final String SYSTEM_BASE =
            "You are a technical HR Recruiter Bot. Screen the candidate with professional questions, one at a time. "
            + "Do not mention internal tags to the candidate. ";

    public AiScreeningManager(
            ChatService chatService,
            JobApplicationService applicationService,
            SimpMessagingTemplate messagingTemplate,
            @Value("${GEMINI_API_KEY:${gemini.api.key:}}") String apiKey) {
        this.chatService = chatService;
        this.applicationService = applicationService;
        this.messagingTemplate = messagingTemplate;
        this.restTemplate = new RestTemplate();
        this.apiKey = apiKey;
    }

    @Override
    public void processAndReply(Integer applicationId, String userMessage) {
        CompletableFuture.runAsync(() -> {
            try {
                JobApplicationStatus currentStatus = applicationService.getStatusById(applicationId);
                if (currentStatus == null || currentStatus != JobApplicationStatus.PENDING) {
                    return;
                }

                if (apiKey == null || apiKey.isBlank()) {
                    sendBotMessage(applicationId, "AI screening is temporarily unavailable. GEMINI_API_KEY is not configured.");
                    return;
                }

                List<ChatMessageDto> history = chatService.getHistory(applicationId);
                int botCount = countBotMessages(history);

                String transcript = buildTranscriptForModel(history);
                String userTurn = transcript.isBlank() ? "BOT:" : transcript + "\nBOT:";

                String systemInstruction = SYSTEM_BASE + phaseInstruction(botCount);

                Map<String, Object> requestBody = Map.of(
                    "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemInstruction))
                    ),
                    "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", userTurn)))
                    )
                );

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                String url = GEMINI_URL + "?key=" + apiKey;
                @SuppressWarnings("unchecked")
                Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

                String botReplyText = extractText(response);

                if (botReplyText != null && !botReplyText.isBlank()) {
                    if (botCount < MIN_AI_SCREENING_QUESTIONS) {
                        botReplyText = stripForbiddenTags(botReplyText);
                    } else {
                        botReplyText = botReplyText.replace(HANDOFF_TAG, "").trim();
                    }

                    sendBotMessage(applicationId, botReplyText);

                    if (botCount >= MIN_AI_SCREENING_QUESTIONS) {
                        applicationService.updateStatus(
                                new UpdateApplicationStatusRequest(applicationId, JobApplicationStatus.AWAITING_RECRUITER));
                    }
                }
            } catch (org.springframework.web.client.HttpStatusCodeException e) {
                System.err.println("Gemini API error status: " + e.getStatusCode());
                System.err.println("Gemini API error body: " + e.getResponseBodyAsString());
                sendBotMessage(applicationId, "AI screening is currently unavailable. Please try again later.");
            } catch (Exception e) {
                System.err.println("Gemini API error: " + e.getMessage());
                e.printStackTrace();
                sendBotMessage(applicationId, "AI screening hit an unexpected error. Please try again.");
            }
        });
    }

    private static int countBotMessages(List<ChatMessageDto> history) {
        if (history == null || history.isEmpty()) {
            return 0;
        }
        int n = 0;
        for (ChatMessageDto msg : history) {
            if (msg.getSenderType() != null && "BOT".equalsIgnoreCase(msg.getSenderType().trim())) {
                n++;
            }
        }
        return n;
    }

    private static String phaseInstruction(int botCount) {
        if (botCount < MIN_AI_SCREENING_QUESTIONS) {
            int next = botCount + 1;
            return "You have asked " + botCount + " screening question(s). You MUST ask exactly one more question "
                    + "(question " + next + " of at least " + MIN_AI_SCREENING_QUESTIONS + "). "
                    + "Do not conclude the interview, do not give final hiring feedback, and do not use any tags like "
                    + HANDOFF_TAG + ", [DECISION: ACCEPTED], or [DECISION: REJECTED].";
        }
        return "You have already asked at least " + MIN_AI_SCREENING_QUESTIONS + " screening questions. "
                + "Do not ask another interview question. Briefly summarize strengths, gaps, and overall fit signal, "
                + "thank the candidate, and say a human recruiter will follow up. "
                + "End your reply with the exact token " + HANDOFF_TAG + " on its own line (for system use only).";
    }

    private static String stripForbiddenTags(String text) {
        return text
                .replace(HANDOFF_TAG, "")
                .replace("[DECISION: ACCEPTED]", "")
                .replace("[DECISION: REJECTED]", "")
                .trim();
    }

    /**
     * Keeps the Gemini prompt small: only the tail of the thread, per-message caps, and a global char budget.
     */
    private static String buildTranscriptForModel(List<ChatMessageDto> history) {
        if (history == null || history.isEmpty()) {
            return "";
        }
        int total = history.size();
        int from = Math.max(0, total - MAX_MESSAGES_IN_PROMPT);
        StringBuilder sb = new StringBuilder();
        if (from > 0) {
            sb.append("[Earlier ").append(from).append(" message(s) omitted for brevity.]\n");
        }
        for (int i = from; i < total; i++) {
            ChatMessageDto msg = history.get(i);
            String type = msg.getSenderType() != null ? msg.getSenderType().trim() : "?";
            sb.append(type).append(": ").append(truncateContent(msg.getContent())).append('\n');
        }
        String s = sb.toString();
        if (s.length() > MAX_PROMPT_CHARS) {
            return s.substring(s.length() - MAX_PROMPT_CHARS);
        }
        return s;
    }

    private static String truncateContent(String content) {
        if (content == null) {
            return "";
        }
        if (content.length() <= MAX_CHARS_PER_MESSAGE) {
            return content;
        }
        return content.substring(0, MAX_CHARS_PER_MESSAGE) + "…";
    }

    private void sendBotMessage(Integer applicationId, String content) {
        SendMessageRequest botMessageRequest = new SendMessageRequest();
        botMessageRequest.setApplicationId(applicationId);
        botMessageRequest.setSenderId(0);
        botMessageRequest.setSenderType("BOT");
        botMessageRequest.setSenderName("AI Recruiter");
        botMessageRequest.setContent(content);

        ChatMessageDto savedDto = chatService.saveMessage(botMessageRequest);
        messagingTemplate.convertAndSend("/topic/chat/" + applicationId, savedDto);
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + e.getMessage());
        }
        return null;
    }
}
