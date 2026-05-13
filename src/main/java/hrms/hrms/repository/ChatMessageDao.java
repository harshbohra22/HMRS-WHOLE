package hrms.hrms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hrms.hrms.entity.ChatMessage;

public interface ChatMessageDao extends JpaRepository<ChatMessage, Long> {

    /**
     * Fetches all messages for a given application (chat room), ordered oldest first.
     */
    List<ChatMessage> findByApplicationIdOrderBySentAtAsc(Integer applicationId);
}
