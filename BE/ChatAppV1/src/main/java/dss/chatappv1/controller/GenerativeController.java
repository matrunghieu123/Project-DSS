package dss.chatappv1.controller;

import dss.chatappv1.controller.dto.ChatRequest;
import dss.chatappv1.controller.dto.ChatResponse;
import dss.chatappv1.service.GenAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class GenerativeController {

    private final GenAIService genAIService;
    @PostMapping
    public ChatResponse getChatResponse(@RequestBody ChatRequest request){
        return new ChatResponse(genAIService.getResponse(request));
    }


}