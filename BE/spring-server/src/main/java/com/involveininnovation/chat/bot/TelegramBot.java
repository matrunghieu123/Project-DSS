package com.involveininnovation.chat.bot;

import com.involveininnovation.chat.model.CustomMessage;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Slf4j
public class TelegramBot extends TelegramLongPollingBot {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private final String botName;

    public TelegramBot(String botName, String botToken){
        super(botToken);
        this.botName = botName;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if(update.hasMessage() && update.getMessage().hasText()){
//            Message message = update.getMessage();
//            var chatId = message.getChatId();
//            log.info("Message receive: {}", message.getChatId());
//            var messageText = message.getText();
//            log.info(messageText);

            String messageText = update.getMessage().getText();
            Long chatId = update.getMessage().getChatId();

            // Send message back to Telegram chat
            SendMessage message = new SendMessage();
            message.setChatId(chatId.toString());
            message.setText("You said: " + messageText);
            log.info("Chat ID"+ chatId);
            log.info("Message: " + messageText);
            try {
                execute(new SendMessage(chatId.toString(), "Hello World"));
            } catch (TelegramApiException e) {
                log.error("Exception during processing telegram api", e.getMessage());
            };
            sendMessageToChatApp(messageText);
        }
    }
    public void sendMessageToChatApp(String messageText) {
        //WebSocket handler that sends messages to connected clients
        messagingTemplate.convertAndSend("/chatroom/public", messageText);
    }
    public void sendMessageToTelegram(Long chatId, String message) {
        SendMessage telegramMessage = new SendMessage();
        telegramMessage.setChatId(chatId.toString());
        telegramMessage.setText("Message from Chat App: " + message);

        try {
            execute(telegramMessage);  // Send the message via Telegram API
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getBotUsername() {
        return this.botName;
    }
}
