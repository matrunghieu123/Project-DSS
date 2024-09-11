package com.dss.chatapp.service;

import com.dss.chatapp.controller.dto.ChatRequest;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiModelName;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenAIServiceImpl implements GenAIService{

    @Value("${openai.api.key}")
    private String openAiApiKey;
    @Override
    public String getResponse(ChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(UserMessage.userMessage(request.question()));
        var model =OpenAiChatModel.builder()
                .apiKey(openAiApiKey)
                .modelName(OpenAiModelName.GPT_3_5_TURBO)
                .build();
        var response = model.generate(messages).content().text();
        return response;
    }
}