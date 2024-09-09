package com.involveininnovation.chat.service;

import com.involveininnovation.chat.controller.dto.ChatRequest;
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
