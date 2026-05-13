package hrms.hrms.business.abstracts;

import java.util.List;

import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.request.SendMessageRequest;

public interface ChatService {

    /**
     * Persists a new chat message.
     * Throws IllegalStateException if the application is not in ACCEPTED status.
     */
    ChatMessageDto saveMessage(SendMessageRequest request);

    /**
     * Returns the full message history for an application (chat room),
     * ordered by sentAt ascending.
     */
    List<ChatMessageDto> getHistory(Integer applicationId);
}
