package com.involveininnovation.chat.controller;

import com.involveininnovation.chat.controller.dto.ChatRequest;
import com.involveininnovation.chat.controller.dto.ChatResponse;
import com.involveininnovation.chat.service.GenAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/chat")
public class GenerativeController {

    private final GenAIService genAIService;
    @PostMapping
    public ChatResponse getChatResponse(@RequestBody ChatRequest request){
//        return genAIService.getResponse(request);
        return null;
    }
}