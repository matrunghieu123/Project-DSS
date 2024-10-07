//package dss.chatappv1.config;
//
//import dss.chatappv1.bot.TelegramWebHook;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.telegram.telegrambots.meta.api.methods.updates.SetWebhook;
//import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
//
//@Configuration
//@Slf4j
//public class CustomWebhookConfig {
//
//    private final TelegramWebHook telegramWebHook;
//
//    @Autowired
//    public CustomWebhookConfig(TelegramWebHook telegramWebHook) {
//
//        this.telegramWebHook = telegramWebHook;
//    }
//
//    @Bean
//    public TelegramWebHook setupWebhook(@Value("${webhook.url}") String webhookUrl) {
//        try {
//            // Tạo đối tượng SetWebhook để thiết lập webhook
//            SetWebhook setWebhook = new SetWebhook();
//            setWebhook.setUrl(webhookUrl);
//
//            // Thiết lập webhook cho TelegramWebHook
//            telegramWebHook.setWebhook(setWebhook);
//            log.info("Webhook has been set: {}", webhookUrl);
//        } catch (TelegramApiException e) {
//            log.error("Error setting webhook: {}", e.getMessage());
//        }
//
//        // Trả về đối tượng TelegramWebHook đã được cấu hình
//        return telegramWebHook; // Giả sử telegramWebHook đã được khởi tạo ở đâu đó
//    }
//}
