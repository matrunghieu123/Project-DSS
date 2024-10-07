package dss.chatappv1.repository;

import dss.chatappv1.controller.dto.MessageDto;
import dss.chatappv1.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByChatIdOrderByTimeAsc(Long chatId, Pageable pageable);
    @Query(value = "SELECT * FROM messages m WHERE (m.sender_name = :senderName AND m.receiver_name = :receiverName) OR (m.sender_name = :receiverName AND m.receiver_name = :senderName) ORDER BY m.time DESC ", nativeQuery = true)
    Page<Message> findMessagesBetweenUsers(@Param("senderName") String senderName, @Param("receiverName") String receiverName, Pageable pageable);

    @Query(value = "SELECT * FROM messages m WHERE m.receiver_name = 'Chat chung' ORDER BY m.time DESC", nativeQuery = true)
    Page<Message> findMessagesByReceiverPublic(Pageable pageable);
}
