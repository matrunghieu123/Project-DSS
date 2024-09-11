package com.dss.chatapp.config;

import com.dss.chatapp.bot.TelegramBot;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
@Slf4j
public class TelegramConfig {

    private TelegramBot telegramBotInstance;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Bean
    @Scope("singleton")
    public TelegramBot telegramBot(@Value("${bot.name}") String botName,
                                   @Value("${bot.token}") String botToken){
        if (telegramBotInstance == null) {
            synchronized (TelegramConfig.class) {
                if (telegramBotInstance == null) {
                    telegramBotInstance = new TelegramBot(botName, botToken, messagingTemplate);
                    try {
                        TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
                        telegramBotsApi.registerBot(telegramBotInstance);
                        log.info("TelegramBot is being initialized: {}", botName);
                    } catch (TelegramApiException e) {
                        log.error("Exception during registration telegram api: {}", e.getMessage());
                    }
                }
            }
        }
        return telegramBotInstance;
    }
}
