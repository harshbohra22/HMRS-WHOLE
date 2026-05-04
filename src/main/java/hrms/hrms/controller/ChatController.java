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
import hrms.hrms.core.utilities.DataResult;
import hrms.hrms.core.utilities.SuccessDataResult;
import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.request.SendMessageRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
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
}
