package dss.chatappv1.service;


import dss.chatappv1.controller.dto.ChatRequest;

public interface GenAIService {
    String getResponse(ChatRequest request);
}
