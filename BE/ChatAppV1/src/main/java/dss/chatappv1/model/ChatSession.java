package dss.chatappv1.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "chat_sessions")
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source; // Telegram, Zalo, Messenger
    private String type; // "private" for 1-on-1 chats, "group" for group chats

    @Column(nullable = false)
    private String participantA; // The first user in the conversation

    @Column(nullable = true)
    private String participantB; // The second user in the conversation, if it's a 1-on-1 chat
    private String groupName; // If it's a group chat

}

