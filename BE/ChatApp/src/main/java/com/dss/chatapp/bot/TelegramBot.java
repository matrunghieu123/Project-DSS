package com.dss.chatapp.bot;

import com.dss.chatapp.model.CustomMessage;
import com.dss.chatapp.model.Status;
import org.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
public class TelegramBot extends TelegramLongPollingBot {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private final String botName;

    // Constructor for the bot
    public TelegramBot(String botName, String botToken, SimpMessagingTemplate messagingTemplate){
        super(botToken);
        this.botName = botName;
        this.messagingTemplate =  messagingTemplate;
    }

    // Method to handle incoming messages from Telegram
    @Override
    public void onUpdateReceived(Update update) {
        if(update.hasMessage() && update.getMessage().hasText()){
            Long chatId = update.getMessage().getChatId();
            String messageText = update.getMessage().getText();

            log.info("Message received from chat ID {}: {}", chatId, messageText);

            // Echo the received message back to Telegram
//            sendMessageToTelegram(chatId, "You said: " + messageText);

            // Broadcast the message to chat app
            broadcastMessageToChatApp(chatId, messageText);
        }
    }

    // Method to send messages to Telegram
    public void sendMessageToTelegram(Long chatId, String message) {

        SendMessage telegramMessage = new SendMessage();
        telegramMessage.setChatId(chatId.toString());
        telegramMessage.setText(message);

        try {
            execute(telegramMessage);  // Send the message via Telegram API
            log.info("Sent message to Telegram chat ID {}: {}", chatId, message);
        } catch (TelegramApiException e) {
            log.error("Error sending message to Telegram chat ID {}: {}", chatId, e.getMessage());
        }
    }

    // Method to handle incoming messages from chat app and forward them to Telegram
    public void handleChatMessage(Long chatId, String chatMessageJson) {
        // Parse the incoming JSON message
        JSONObject jsonObject = new JSONObject(chatMessageJson);
        String message = jsonObject.getString("message");

        // Send the extracted message to Telegram
        sendMessageToTelegram(chatId, message);
    }

    // Broadcast message from Telegram to chat app using WebSocket
    public void broadcastMessageToChatApp(Long chatId, String messageText) {
//        JSONObject messageJson = new JSONObject();
//        messageJson.put("senderName", "Telegram");
//        messageJson.put("message", messageText);
//        messageJson.put("status", "MESSAGE");
//
//        // Send the message to the WebSocket topic
//        messagingTemplate.convertAndSend("/chatroom/public", messageJson.toString());
//
//        log.info("Broadcasted message to chat app: {}", messageJson.toString());
        String timestamp = getCurrentTime();

        // Create a CustomMessage object
        CustomMessage customMessage = new CustomMessage();
        customMessage.setChatId(chatId);
        customMessage.setMessage(messageText);
        customMessage.setSenderName("Telegram");
        customMessage.setTime(timestamp);  // Set timestamp
        customMessage.setStatus(Status.MESSAGE);  // Set status (enum for status)

        // Send the message to the WebSocket topic
        messagingTemplate.convertAndSend("/chatroom/public", customMessage);

        log.info("Broadcasted message to chat app: {}", customMessage);
    }

    public String getCurrentTime(){
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy");
        return LocalDateTime.now().format(dateTimeFormatter);
    }

    @Override
    public String getBotUsername() {
        return this.botName;
    }
}
