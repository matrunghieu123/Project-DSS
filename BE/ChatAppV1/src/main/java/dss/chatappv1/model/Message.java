package dss.chatappv1.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long message_id;

    @Column(nullable = true)
    private Long chatId;

    private String senderName;

    private String receiverName;

    @Column(nullable = true)
    private String fileUrl; // for file attachment

    @Column(nullable = true)
    private String fileType;

    @Column(nullable = true)
    private String message;

    @Column(nullable = false)
    private String time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

}
