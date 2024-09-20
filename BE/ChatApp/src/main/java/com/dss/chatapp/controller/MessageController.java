package com.dss.chatapp.controller;

import com.dss.chatapp.bot.TelegramBot;
import com.dss.chatapp.model.Message;
import com.dss.chatapp.model.Status;
import com.dss.chatapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class MessageController {

    private static final String UPLOADED_FOLDER = "upload" ;


    @Autowired
    TelegramBot telegramBot;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public void receiveMessageTelegram(@Payload Message message) {
        String timestamp = getCurrentTime();
        message.setTime(timestamp);
        Long chatID = getChatID();
        message.setChatId(chatID);
        message.setStatus(Status.SENT);

        messageService.saveMessage(message);

        // Send message to chat app (websockets, etc.)
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);

        // Handle if it's a file message
        if (message.getFileUrl() != null) {
            telegramBot.handleFileMessage(message); // Delegate to TelegramBot
        } else {
            // Handle a regular text message
            telegramBot.sendMessageToTelegram(message.getChatId(), message.getMessage());
            message.setStatus(Status.RECEIVED);
        }
    }

    @PostMapping("/api/upload")
    public String uploadFile(
            @RequestParam("senderName") String senderName,
            @RequestParam("receiverName") String receiverName,
            @RequestParam("message") String messageText,
            @RequestParam("file") MultipartFile file) {

        String fileUrl = null;
        if (!file.isEmpty()) {
            try {
                String fileName = file.getOriginalFilename();
                Path path = Paths.get(UPLOADED_FOLDER + fileName);
                Files.write(path, file.getBytes());
                fileUrl = "/uploads/" + fileName;
            } catch (IOException e) {
                e.printStackTrace();
                return "File upload failed";
            }
        }

        Message message = new Message();
        message.setSenderName(senderName);
        message.setReceiverName(receiverName);
        message.setMessage(messageText);
        message.setFileUrl(fileUrl);
        message.setFileType(file.getContentType());
        message.setTime(getCurrentTime());
        message.setStatus(Status.SENT);

        messageService.saveMessage(message); // Save message to DB
        simpMessagingTemplate.convertAndSend("/chatroom/public", message);

        return "File uploaded successfully";
    }

//    @MessageMapping("public-message")
//    @SendTo("chatroom/public")
//    public void receiveMessagePublic(@Payload Message message){
//        String timestamp = getCurrentTime();
//        message.setTime(timestamp);
//        simpMessagingTemplate.convertAndSend("/chatroom/public");
//    }

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
