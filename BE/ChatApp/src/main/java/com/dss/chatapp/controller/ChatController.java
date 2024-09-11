package com.dss.chatapp.controller;

import com.dss.chatapp.bot.TelegramBot;
import com.dss.chatapp.model.CustomMessage;
import com.dss.chatapp.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ChatController {

    @Autowired TelegramBot telegramBot;
    @Autowired
    ChatService chatService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
        public void receiveMessage(@RequestParam String message){
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
        Long chatID = getChatID();
        telegramBot.handleChatMessage(message, chatID);
    }

    @MessageMapping("/private-message")
    public CustomMessage recMessage(@Payload CustomMessage customMessage){
        simpMessagingTemplate.convertAndSendToUser(customMessage.getReceiverName(),"/private", customMessage);
        System.out.println(customMessage.toString());
        return customMessage;
    }

    private Long getChatID(){
        return 5739833199L;
    }
}
