package hrms.hrms.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {

    private Long id;
    private Integer applicationId;
    private String senderType;   // "EMPLOYER" or "JOBSEEKER"
    private Integer senderId;
    private String senderName;
    private String content;
    private LocalDateTime sentAt;
}
