package hrms.hrms.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * Links this message to a specific job application (the chat room).
     * Only ACCEPTED applications are allowed to chat (enforced in service layer).
     */
    @Column(name = "application_id", nullable = false)
    private Integer applicationId;

    /**
     * Either "EMPLOYER" or "JOBSEEKER"
     */
    @Column(name = "sender_type", nullable = false, length = 20)
    private String senderType;

    /**
     * ID of the sender (employer ID or job seeker ID)
     */
    @Column(name = "sender_id", nullable = false)
    private Integer senderId;

    /**
     * Display name of the sender (company name or full name)
     */
    @Column(name = "sender_name", nullable = false, length = 255)
    private String senderName;

    /**
     * The actual message body
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();
}
