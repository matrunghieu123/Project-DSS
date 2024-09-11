package com.dss.chatapp.controller;

import com.dss.chatapp.bot.TelegramBot;
import com.dss.chatapp.model.CustomMessage;
import com.dss.chatapp.model.Status;
import com.dss.chatapp.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
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
        public CustomMessage receiveMessage(@Payload String message){
        CustomMessage customMessage = new CustomMessage();
        customMessage.setMessage(message);
        customMessage.setStatus(Status.MESSAGE);
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
        Long telegram_chatID = getChatID();
        telegramBot.handleChatMessage(telegram_chatID, customMessage.getMessage());
        return customMessage;
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
