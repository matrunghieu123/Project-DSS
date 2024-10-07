//package dss.chatappv1.bot;
//
//import dss.chatappv1.controller.dto.MessageDto;
//import dss.chatappv1.model.Status;
//import dss.chatappv1.service.MessageService;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Component;
//import org.telegram.telegrambots.bots.TelegramWebhookBot;
//import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
//import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
//import org.telegram.telegrambots.meta.api.objects.Update;
//import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//
//@Slf4j
//@Component
//public class TelegramWebHook extends TelegramWebhookBot {
//    private final SimpMessagingTemplate messagingTemplate;
//    private final MessageService messageService;
//
//    private final String botName;
//    private final String botToken;
//
//    @Autowired
//    public TelegramWebHook(@Value("${bot.name}") String botName,@Value("${bot.token}") String botToken, SimpMessagingTemplate messagingTemplate, MessageService messageService) {
//        this.botName = botName;
//        this.botToken = botToken;
//        this.messagingTemplate = messagingTemplate;
//        this.messageService = messageService;
//    }
//
//    @Override
//    public BotApiMethod<?> onWebhookUpdateReceived(Update update) {
//        // Kiểm tra xem update có chứa tin nhắn và tin nhắn có chứa văn bản hay không
//        if (update.hasMessage() && update.getMessage().hasText()) {
//            Long chatId = update.getMessage().getChatId();
//            String messageText = update.getMessage().getText();
//            log.info("Message received from chat ID {}: {}", chatId, messageText);
//
//            // Gọi phương thức để phát tán tin nhắn
//            broadcastMessageToChatApp(chatId, messageText);
//        }
//        return null;
//    }
//
//    @Override
//    public String getBotPath() {
//        return null;
//    }
//
//    public void sendMessageToTelegram(Long chatId, String message) {
//        SendMessage telegramMessage = new SendMessage();
//        telegramMessage.setChatId(chatId.toString()); // Đặt chatId dưới dạng String
//        telegramMessage.setText(message);
//
//        try {
//            execute(telegramMessage);  // Gửi tin nhắn qua Telegram API
//            log.info("Sent message to Telegram chat ID {}: {}", chatId, message);
//        } catch (TelegramApiException e) {
//            log.error("Error sending message to Telegram chat ID {}: {}", chatId, e.getMessage());
//        }
//    }
//
//    public void broadcastMessageToChatApp(Long chatId, String messageText) {
//        MessageDto message = new MessageDto();
//        message.setChatId(chatId);
//        message.setMessage(messageText);
//        message.setSenderName("Telegram");
//        message.setTime(getCurrentTime());
//        message.setStatus(Status.RECEIVED);
//
//        messageService.createMessage(message);
//        messagingTemplate.convertAndSend("/chatroom/public", message);
//        log.info("Broadcast message to chat app: {}", message);
//    }
//
//    public String getCurrentTime() {
//        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
//        return LocalDateTime.now().format(dateTimeFormatter);
//    }
//
//    @Override
//    public String getBotUsername() {
//        return this.botName;
//    }
//
//    @Override
//    public String getBotToken() {
//        return this.botToken;
//    }
//}
