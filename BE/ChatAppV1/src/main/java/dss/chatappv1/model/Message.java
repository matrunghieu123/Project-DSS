package dss.chatappv1.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long chatId;

    private String senderName;

    private String receiverName;

    @Column(nullable = true)
    private String fileUrl; // for file attachment

    @Column(nullable = true)
    private String fileType;

    private String file;
    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public Message() {

    }
}
