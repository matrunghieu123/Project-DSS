package dss.chatappv1.controller;

import dss.chatappv1.bot.TelegramBot;
import dss.chatappv1.model.Message;
import dss.chatappv1.model.Status;
import dss.chatappv1.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Slf4j
@CrossOrigin(origins ="*")
public class TelegramChatController {
    @Autowired
    TelegramBot telegramBot;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private static final String UPLOADED_FOLDER = "C:\\Users\\ADMIN\\Downloads\\";
    @MessageMapping("/message/telegram")
    @SendTo("/chatroom/telegram")
    public void chatTelegram (@Payload Message message) {
        String timestamp = "getCurrentTime()";
        message.setTime(timestamp);
        Long chatID = message.getChatId();
        message.setChatId(chatID);
        message.setStatus(Status.SENT);


        // Send message to chat app
        simpMessagingTemplate.convertAndSend("/chatroom/telegram", message);

        if (message.getFileUrl() != null) {
            telegramBot.sendFileToTelegram(message); // Delegate to TelegramBot

        } else {
            telegramBot.sendMessageToTelegram(message.getChatId(), message.getMessage());
            message.setStatus(Status.RECEIVED);
        }
        log.info("Response:"+new ResponseEntity<>(message, HttpStatus.OK));
    }

    @PostMapping("/telegram/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("senderName") String senderName,
            @RequestParam("receiverName") String receiverName,
            @RequestParam(value = "message", required = false) String messageText,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Message message = new Message();
        Map<String, String> response = new HashMap<>();
        String fileUrl = null;
        String fileType = null;

        // Xử lý việc upload file
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "fileUrl_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOADED_FOLDER, fileName); // đường dẫn

                if (!Files.exists(path.getParent())) {
                    Files.createDirectories(path.getParent());
                }

                Files.write(path, file.getBytes());

                if (Files.exists(path)) {
                    fileUrl = UPLOADED_FOLDER + fileName; // Tạo URL
                    fileType = file.getContentType();
                    response.put("fileUrl", fileUrl);
                    response.put("fileType", fileType);
                }
            } catch (IOException e) {
                e.printStackTrace();
                response.put("error", "File upload failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        message.setSenderName(senderName);
        message.setReceiverName(receiverName);
        message.setMessage(messageText);
        message.setFileUrl(fileUrl);
        message.setFileType(fileType);
        message.setTime(getCurrentTime());
        message.setStatus(Status.SENT);

        // Gọi phương thức receiveMessageTelegram để gửi tin nhắn
        chatTelegram(message);

        // Trả về phản hồi sau khi hoàn thành
        response.put("status", "Message sent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("telegram/messages")
    public List<Update> getPaginatedMessages(@RequestParam int limit) {
        try {
            return telegramBot.getPaginatedUpdates(limit);  // Lấy tin nhắn phân trang
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String getCurrentTime() {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        return LocalDateTime.now().format(dtf);
    }

}
