package com.dss.chatapp.controller;

import com.dss.chatapp.bot.TelegramBot;
import com.dss.chatapp.model.Message;
import com.dss.chatapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class MessageController {

    @Autowired
    MessageService messageService;
    @Autowired
    TelegramBot telegramBot;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/telegram-message")
    @SendTo("/chatroom/telegram")
    public void receiveMessageTelegram(@Payload Message message) {
        String timestamp = getCurrentTime();
        message.setTime(timestamp);
        simpMessagingTemplate.convertAndSend("/chatroom/telegram", message);
        Long telegramChatId = getChatID();
        telegramBot.sendMessageToTelegram(telegramChatId, message.getMessage());
        System.out.println(message);
    }

    @MessageMapping("public-message")
    @SendTo("chatroom/public")
    public void receiveMessagePublic(@Payload Message message){
        String timestamp = getCurrentTime();
        message.setTime(timestamp);
        simpMessagingTemplate.convertAndSend("/chatroom/public");
    }

    private String getCurrentTime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");
        return LocalDateTime.now().format(dtf);
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        System.out.println(message);
        return message;
    }

    private Long getChatID() {
        return 5739833199L;
    }
}
