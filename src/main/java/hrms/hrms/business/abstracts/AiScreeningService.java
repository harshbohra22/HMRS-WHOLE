package hrms.hrms.business.abstracts;

public interface AiScreeningService {
    
    /**
     * Processes a user message and generates an AI response.
     * The response should be saved and broadcasted to the chat room.
     */
    void processAndReply(Integer applicationId, String userMessage);
}
