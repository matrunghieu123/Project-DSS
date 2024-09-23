package dss.chatappv1.bot;

import dss.chatappv1.model.Message;
import dss.chatappv1.model.Status;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
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

    // Broadcast message from Telegram to chat app using WebSocket
    public void broadcastMessageToChatApp(Long chatId, String messageText) {
        String timestamp = getCurrentTime();

        // Create a Message object
        Message message = new Message();
        message.setChatId(chatId);
        message.setMessage(messageText);
        message.setSenderName("Telegram");
        message.setTime(timestamp);  // Set timestamp
        message.setStatus(Status.MESSAGE);  // Set status (enum for status)

        // Send the message to the WebSocket topic
        messagingTemplate.convertAndSend("/chatroom/public", message);

        log.info("Broadcast message to chat app: {}", message);
    }

    // Method to handle both file and text messages
    public void handleFileMessage(Message message) {
        Long chatId = message.getChatId();
        String fileUrl = message.getFileUrl();

        try {
            if (message.getFileType().startsWith("image")) {
                sendPhotoToTelegram(chatId, fileUrl);
            } else if (message.getFileType().startsWith("application")) {
                sendDocumentToTelegram(chatId, fileUrl);
            } else {
                // Log unsupported file types and handle them appropriately
                log.warn("Unsupported file type: {}", message.getFileType());
            }
        } catch (TelegramApiException e) {
            log.error("Error sending file to Telegram chat ID {}: {}", chatId, e.getMessage());
        }
    }

    // Method to send photo to Telegram using URL
    private void sendPhotoToTelegram(Long chatId, String fileUrl) throws TelegramApiException {
        SendPhoto sendPhoto = new SendPhoto();
        sendPhoto.setChatId(chatId.toString());

        // Use InputFile to send the photo from URL
        InputFile photo = new InputFile(fileUrl);
        sendPhoto.setPhoto(photo);

        execute(sendPhoto);  // Send photo via Telegram API
        log.info("Sent photo to Telegram chat ID {}: {}", chatId, fileUrl);
    }

    // Method to send document to Telegram using URL
    private void sendDocumentToTelegram(Long chatId, String fileUrl) throws TelegramApiException {
        SendDocument sendDocument = new SendDocument();
        sendDocument.setChatId(chatId.toString());

        // Use InputFile to send the document from URL
        InputFile document = new InputFile(fileUrl);
        sendDocument.setDocument(document);

        execute(sendDocument);  // Send document via Telegram API
        log.info("Sent document to Telegram chat ID {}: {}", chatId, fileUrl);
    }

    public String getCurrentTime(){
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        return LocalDateTime.now().format(dateTimeFormatter);
    }

    @Override
    public String getBotUsername() {
        return this.botName;
    }

}
