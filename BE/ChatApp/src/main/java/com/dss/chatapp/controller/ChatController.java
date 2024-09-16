package com.dss.chatapp.controller;

import com.dss.chatapp.bot.TelegramBot;
import com.dss.chatapp.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class ChatController {

    @Autowired
    TelegramBot telegramBot;


    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public void receiveMessage(@Payload Message message) {

//        if (message.getFileUrl() != null && !message.getFileUrl().isEmpty()) {
//            // Process file
//            Long telegramChatId = getChatID();
//            telegramBot.handleChatFile(telegramChatId, message);
//        } else {
//            // Process text message
//            simpMessagingTemplate.convertAndSend("/chatroom/public", message);
//            Long telegramChatId = getChatID();
//            telegramBot.handleChatMessage(telegramChatId, message);
//        }
        String timestamp = getCurrentTime();
        message.setTime(timestamp);
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
        Long telegramChatId = getChatID();
        telegramBot.sendMessageToTelegram(telegramChatId, message.getMessage());
        System.out.println(message);
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/telegram")
    public void receiveMessageTelegram(@Payload Message message) {
//        if (message.getFileUrl() != null && !message.getFileUrl().isEmpty()) {
//            // Process file
//            Long telegramChatId = getChatID();
//            telegramBot.handleChatFile(telegramChatId, message);
//        } else {
//            // Process text message
//            simpMessagingTemplate.convertAndSend("/chatroom/public", message);
//            Long telegramChatId = getChatID();
//            telegramBot.handleChatMessage(telegramChatId, message);
//        }
        String timestamp = getCurrentTime();
        message.setTime(timestamp);
        simpMessagingTemplate.convertAndSend("/chatroom/telegram", message);
        Long telegramChatId = getChatID();
        telegramBot.sendMessageToTelegram(telegramChatId, message.getMessage());
        System.out.println(message);
    }

    @MessageMapping("message")
    @SendTo("/chatroom/public")
    public void receiveMessagePublic(@Payload Message message){
        String timestamps = getCurrentTime();
        message.setTime(timestamps);
        simpMessagingTemplate.convertAndSend("chatroom/public", message);
    }

    private String getCurrentTime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");
        return LocalDateTime.now().format(dtf);
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        System.out.println(message.toString());
        return message;
    }

    private Long getChatID() {
        return 5739833199L;
    }
}
