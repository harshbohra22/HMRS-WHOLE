package hrms.hrms.business.concretes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import hrms.hrms.business.abstracts.ChatService;
import hrms.hrms.dto.ChatMessageDto;
import hrms.hrms.dto.request.SendMessageRequest;
import hrms.hrms.entity.ChatMessage;
import hrms.hrms.entity.JobApplication;
import hrms.hrms.entity.JobApplicationStatus;
import hrms.hrms.repository.ChatMessageDao;
import hrms.hrms.repository.JobApplicationDao;

@Service
public class ChatManager implements ChatService {

    private final ChatMessageDao chatMessageDao;
    private final JobApplicationDao jobApplicationDao;

    public ChatManager(ChatMessageDao chatMessageDao, JobApplicationDao jobApplicationDao) {
        this.chatMessageDao = chatMessageDao;
        this.jobApplicationDao = jobApplicationDao;
    }

    @Override
    public ChatMessageDto saveMessage(SendMessageRequest request) {
        // Guard temporarily removed for local demo
        /*
        JobApplication application = jobApplicationDao.findById(request.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Application not found with id: " + request.getApplicationId()));

        if (application.getStatus() != JobApplicationStatus.ACCEPTED) {
            throw new IllegalStateException(
                    "Chat is only available for accepted applications. Current status: " + application.getStatus());
        }
        */

        // Persist the message
        ChatMessage message = new ChatMessage();
        message.setApplicationId(request.getApplicationId());
        message.setSenderType(request.getSenderType());
        message.setSenderId(request.getSenderId());
        message.setSenderName(request.getSenderName());
        message.setContent(request.getContent());
        message.setSentAt(LocalDateTime.now());

        ChatMessage saved = chatMessageDao.save(message);
        return toDto(saved);
    }

    @Override
    public List<ChatMessageDto> getHistory(Integer applicationId) {
        return chatMessageDao
                .findByApplicationIdOrderBySentAtAsc(applicationId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ChatMessageDto toDto(ChatMessage msg) {
        return new ChatMessageDto(
                msg.getId(),
                msg.getApplicationId(),
                msg.getSenderType(),
                msg.getSenderId(),
                msg.getSenderName(),
                msg.getContent(),
                msg.getSentAt()
        );
    }
}
