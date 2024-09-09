package com.involveininnovation.chat.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public ChatService(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendMessageToChatApp(String messageText) {
        try {
            // Parse the JSON input
            JsonNode jsonNode = objectMapper.readTree(messageText);

            // Extract the message field
            String message = jsonNode.get("message").asText();

            // Send only the message to WebSocket clients
            messagingTemplate.convertAndSend("/chatroom/public", message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
