package com.dss.chatapp.service;

import com.dss.chatapp.controller.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenAIServiceImpl implements GenAIService{
    @Override
    public String getResponse(ChatRequest request) {

        return null;
    }
}
