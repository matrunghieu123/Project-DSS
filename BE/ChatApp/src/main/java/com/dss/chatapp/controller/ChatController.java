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

    @Autowired TelegramBot telegramBot;

    private static String UPLOAD_DIR = "uploads/";
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
        public void receiveMessage(@Payload String message){
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
        Long telegram_chatID = getChatID();
        telegramBot.handleChatMessage(telegram_chatID, message);
        System.out.println(message);
    }

//    @MessageMapping("/file-upload")
//    @SendTo("/chatroom/public")
//    public CustomMessage uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("senderName") String senderName) throws IOException {
//        // Save the file locally
//        String fileName = saveFile(file);
//
//        // Create a new CustomMessage containing the file URL
//        CustomMessage message = new CustomMessage();
//        message.setSenderName(senderName);
//        message.setFileUrl("/files/" + fileName);  // File URL
//        message.setTime(getCurrentTime());
//        message.setStatus(Status.FILE);
//
//        simpMessagingTemplate.convertAndSend("/chatroom/public", message);
//
//        return message;
//    }

    private String getCurrentTime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return LocalDateTime.now().format(dtf);
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private", message);
        System.out.println(message.toString());
        return message;
    }

    private Long getChatID(){
        return 5739833199L;
    }
}
