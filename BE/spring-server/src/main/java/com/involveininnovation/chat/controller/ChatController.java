package com.involveininnovation.chat.controller;

import com.involveininnovation.chat.bot.TelegramBot;
import com.involveininnovation.chat.model.CustomMessage;
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
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public void receiveMessage(@RequestParam String message){
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
        Long chatID = getChatID();
        telegramBot.sendMessageToTelegram(chatID, message.toString());
        telegramBot.sendMessageToChatApp(message);
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
