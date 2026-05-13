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

    private final ChatService chatService;
    private final JobApplicationService applicationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RestTemplate restTemplate;
    private final String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    private static final String SYSTEM_INSTRUCTION =
            "You are a technical HR Recruiter Bot. " +
            "Screen the candidate by asking professional questions (one at a time). " +
            "After 3-5 questions, if you have enough info, conclude the interview. " +
            "If they are a good fit, end your message with [DECISION: ACCEPTED]. " +
            "If not a fit, end with [DECISION: REJECTED]. " +
            "Do not mention these tags to the user.";

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
                // Guard: only reply during the AI screening phase (PENDING status)
                JobApplicationStatus currentStatus = applicationService.getStatusById(applicationId);
                if (currentStatus == null || currentStatus != JobApplicationStatus.PENDING) {
                    // Application already decided — human recruiter handles the chat now
                    return;
                }

                if (apiKey == null || apiKey.isBlank()) {
                    sendBotMessage(applicationId, "AI screening is temporarily unavailable. GEMINI_API_KEY is not configured.");
                    return;
                }

                // 1. Fetch chat history for context
                List<ChatMessageDto> history = chatService.getHistory(applicationId);
                StringBuilder historyText = new StringBuilder();
                if (history != null) {
                    for (ChatMessageDto msg : history) {
                        historyText.append(msg.getSenderType()).append(": ").append(msg.getContent()).append("\n");
                    }
                }
                historyText.append("USER: ").append(userMessage).append("\nAI:");

                // 2. Build the Gemini API request body
                Map<String, Object> requestBody = Map.of(
                    "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_INSTRUCTION))
                    ),
                    "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", historyText.toString())))
                    )
                );

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                String url = GEMINI_URL + "?key=" + apiKey;
                @SuppressWarnings("unchecked")
                Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

                // 3. Extract and parse the bot reply
                String botReplyText = extractText(response);

                if (botReplyText != null && !botReplyText.isBlank()) {
                    // Check for decision tags
                    if (botReplyText.contains("[DECISION: ACCEPTED]")) {
                        applicationService.updateStatus(new UpdateApplicationStatusRequest(applicationId, JobApplicationStatus.ACCEPTED));
                        botReplyText = botReplyText.replace("[DECISION: ACCEPTED]", "").trim();
                    } else if (botReplyText.contains("[DECISION: REJECTED]")) {
                        applicationService.updateStatus(new UpdateApplicationStatusRequest(applicationId, JobApplicationStatus.REJECTED));
                        botReplyText = botReplyText.replace("[DECISION: REJECTED]", "").trim();
                    }

                    // 4. Save and Broadcast
                    sendBotMessage(applicationId, botReplyText);
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
