package com.involveininnovation.chat.bot;

import org.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Slf4j
public class TelegramBot extends TelegramLongPollingBot {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private final String botName;

    // Constructor for the bot
    public TelegramBot(String botName, String botToken){
        super(botToken);
        this.botName = botName;
    }

    // Method to handle incoming messages from Telegram
    @Override
    public void onUpdateReceived(Update update) {
        if(update.hasMessage() && update.getMessage().hasText()){
            Long chatId = update.getMessage().getChatId();
            String messageText = update.getMessage().getText();

            log.info("Message received from chat ID {}: {}", chatId, messageText);

            // Echo the received message back to Telegram (you can customize this)
            sendMessageToTelegram(chatId, "You said: " + messageText);

            // Optionally, broadcast the message to your chat app
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

    // Method to handle incoming messages from your chat app and forward them to Telegram
    public void handleChatMessage(String chatMessageJson, Long chatId) {
        // Parse the incoming JSON message
        JSONObject jsonObject = new JSONObject(chatMessageJson);
        String message = jsonObject.getString("message");

        // Send the extracted message to Telegram
        sendMessageToTelegram(chatId, message);
    }

    // Broadcast message from Telegram to chat app using WebSocket
    public void broadcastMessageToChatApp(Long chatId, String messageText) {
        JSONObject messageJson = new JSONObject();
        messageJson.put("senderName", "Telegram");
        messageJson.put("message", messageText);
        messageJson.put("status", "MESSAGE");

        // Send the message to the WebSocket topic
        messagingTemplate.convertAndSend("/chatroom/public", messageJson.toString());

        log.info("Broadcasted message to chat app: {}", messageJson.toString());
    }

    @Override
    public String getBotUsername() {
        return this.botName;
    }
}
