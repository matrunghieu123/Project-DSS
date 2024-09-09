package com.involveininnovation.chat.service;

import com.involveininnovation.chat.controller.dto.ChatRequest;

public interface GenAIService {
    String getResponse(ChatRequest request);
}
