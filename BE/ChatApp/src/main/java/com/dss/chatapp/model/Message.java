package com.dss.chatapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long id;

    private Long chatId;

    private String senderName;

    private String receiverName;

    private String fileUrl; // for file attachment

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String time = LocalDateTime.now().toString();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public Message() {

    }
}
