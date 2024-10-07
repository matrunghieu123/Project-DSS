package dss.chatappv1.controller;

import dss.chatappv1.bot.TelegramBot;
import dss.chatappv1.controller.dto.CMChatDto;
import dss.chatappv1.model.CMChat;
import dss.chatappv1.model.Status;
import dss.chatappv1.service.CMChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
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
public class CMChatController {

    private static final String UPLOADED_FOLDER = "C:\\Users\\ADMIN\\Downloads\\";

    @Autowired
    TelegramBot telegramBot;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private CMChatService cmChatService;

    @MessageMapping("/messagev2")
    @SendTo("/chatroom/publicv2")
    public ResponseEntity<CMChat> receiveMessageTelegram(@Payload CMChat message) {
        message.setCreated(LocalDateTime.now());
        message.setIStatus(1L);

        CMChat newMessage = cmChatService.createCMChat(message);

        simpMessagingTemplate.convertAndSend("/chatroom/public", newMessage);
        return new ResponseEntity<>(newMessage, HttpStatus.OK);
    }

    @PostMapping("/api/uploadv2")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("senderName") String socialName,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Map<String, String> response = new HashMap<>();
        String fileUrl = null;
        String fileType = null;

        // Xử lý việc upload file
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_fileUrl_" + file.getOriginalFilename();
                Path path = Paths.get(UPLOADED_FOLDER, fileName);

                if (!Files.exists(path.getParent())) {
                    Files.createDirectories(path.getParent());
                }

                Files.write(path, file.getBytes());

                if (Files.exists(path)) {
                    fileUrl = "/uploads/" + fileName; // Tạo URL cho file
                    response.put("fileUrl", fileUrl);
                    fileType = file.getContentType();
                    response.put("fileType", fileType);

                }
            } catch (IOException e) {
                e.printStackTrace();
                response.put("error", "File upload failed: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }
        // Tạo đối tượng CMChat
        CMChat message = new CMChat();
        message.setSocialName(socialName);
        message.setContentText(fileUrl);
        // Gán dữ liệu vào contentText và xác định datatype
        if (message.getContentText() != null) {
            if (fileType.startsWith("application")) {
                message.setDataType("File"); // Nếu là file
            } else if (fileType.startsWith("image")||fileType.endsWith(".jpg") || message.getContentText().endsWith(".png")) {
                message.setDataType("Image"); // Nếu là hình ảnh
            } else if (fileType.startsWith("video") || fileType.endsWith(".mp4") || message.getContentText().endsWith(".avi")) {
                message.setDataType("Video"); // Nếu là video
            } else if (fileType.startsWith("audio") || fileType.endsWith(".mp3") || fileType.endsWith("wav")) {
                message.setDataType("Audio"); // Nếu là video
            } else {
                message.setDataType("Text"); // Nếu là văn bản
            }
        }
        // Gọi phương thức receiveMessageTelegram để gửi tin nhắn
        receiveMessageTelegram(message);

        // Trả về phản hồi sau khi hoàn thành
        response.put("status", "Message sent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/v2/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get(UPLOADED_FOLDER).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Determine the file's content type
                String contentType = Files.probeContentType(file);

                // Fallback to octet-stream if content type is not determined
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/v2/chat/history")
    public ResponseEntity<List<CMChat>> getChatHistory(
            @RequestParam(value = "chatId", required = false) Long chatId,
            @RequestParam(value = "senderName", required = false) String senderName,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        Page<CMChat> chatHistory;
        Pageable pageable = PageRequest.of(page, size);

        if (chatId != null) {
            chatHistory = cmChatService.getMessagesByChatId(chatId, pageable);
        } else if (senderName != null) {
            chatHistory = cmChatService.getMessagesBetweenUsers(senderName, pageable);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(chatHistory.getContent(), HttpStatus.OK);
    }

    @PutMapping("/message/statusv2")
    public ResponseEntity<CMChat> updateMessageStatus(@RequestParam("messageId") Long messageId,
                                                      @RequestParam("status") Long status) {
        CMChat message = cmChatService.findMessageById(messageId);

        if (message != null) {
            // Cập nhật trạng thái tin nhắn
            message.setIStatus(status);
            message.setUpdated(LocalDateTime.now());

            CMChat updatedMessage = cmChatService.updateMessageStatus(message);

            // Gửi trạng thái tin nhắn cập nhật đến FE
            simpMessagingTemplate.convertAndSend("/chatroom/public", updatedMessage);

            return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

//    @MessageMapping("/private-message")
//    public CMChat recMessage(@Payload CMChat message) {
//        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
//        return message;
//    }

    private Long getChatID() {
        return 5739833199L;
    }
}
