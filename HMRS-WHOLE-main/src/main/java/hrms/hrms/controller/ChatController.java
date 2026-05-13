package hrms.hrms.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hrms.hrms.business.abstracts.ChatService;
import hrms.hrms.business.abstracts.AiScreeningService;
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.request.SendMessageRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final AiScreeningService aiScreeningService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, AiScreeningService aiScreeningService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.aiScreeningService = aiScreeningService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * STOMP endpoint: clients send to /app/chat.send
     * Server broadcasts the saved message to /topic/chat/{applicationId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request) {
        ChatMessageDto saved = chatService.saveMessage(request);
        // Broadcast to all subscribers of this chat room
        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getApplicationId(),
                saved
        );
        
        // If message is from a Job Seeker, trigger AI reply
        String type = request.getSenderType();
        if ("JOB_SEEKER".equalsIgnoreCase(type) || "JOBSEEKER".equalsIgnoreCase(type)) {
            aiScreeningService.processAndReply(request.getApplicationId(), request.getContent());
        }
    }

    /**
     * REST endpoint: GET /api/chat/{applicationId}/history
     * Returns the full conversation history for a chat room.
     */
    @GetMapping("/{applicationId}/history")
    public DataResult<List<ChatMessageDto>> getHistory(@PathVariable Integer applicationId) {
        List<ChatMessageDto> history = chatService.getHistory(applicationId);
        return new SuccessDataResult<>(history, "Chat history loaded.");
    }

    @GetMapping("/test-ai")
    public DataResult<String> testAi() {
        SendMessageRequest request = new SendMessageRequest();
        request.setApplicationId(1);
        request.setSenderType("JOB_SEEKER");
        request.setSenderId(1);
        request.setSenderName("Test User");
        request.setContent("Hi, I am ready for the screening interview. I have 3 years of experience in Java.");
        
        sendMessage(request);
        return new SuccessDataResult<>("Test message sent, AI should reply in the background", "Success");
    }
}
