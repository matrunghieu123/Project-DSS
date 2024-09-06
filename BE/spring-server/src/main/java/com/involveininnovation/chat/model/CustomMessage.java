package com.involveininnovation.chat.model;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class CustomMessage {
    private long chatId;
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private Status status;

    public CustomMessage(){}

    public CustomMessage(long chatId, String message) {
        this.chatId = chatId;
        this.message = message;
    }


}
