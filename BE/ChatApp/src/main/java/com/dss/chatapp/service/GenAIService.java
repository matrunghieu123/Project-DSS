package com.dss.chatapp.service;

import com.dss.chatapp.controller.dto.ChatRequest;

public interface GenAIService {
    String getResponse(ChatRequest request);
}
