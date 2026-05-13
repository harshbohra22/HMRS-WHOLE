package hrms.hrms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotNull(message = "Application ID is required.")
    private Integer applicationId;

    /**
     * Must be "EMPLOYER" or "JOBSEEKER"
     */
    @NotBlank(message = "Sender type is required.")
    private String senderType;

    @NotNull(message = "Sender ID is required.")
    private Integer senderId;

    /**
     * Display name shown in the chat bubble header
     */
    @NotBlank(message = "Sender name is required.")
    private String senderName;

    @NotBlank(message = "Message content cannot be blank.")
    private String content;
}
