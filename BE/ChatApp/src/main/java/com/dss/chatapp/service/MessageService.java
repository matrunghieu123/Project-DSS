package com.dss.chatapp.service;

import com.dss.chatapp.controller.dto.MessageDto;
import com.dss.chatapp.model.Message;
import com.dss.chatapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public Message createMessage(MessageDto request){
        Message message = new Message();
        message.setMessage(request.getMessage());
        message.setTime(request.getTime());
        message.setFileUrl(request.getFileUrl());
        message.setStatus(request.getStatus());
        message.setSenderName(request.getSenderName());
        message.setReceiverName(request.getReceiverName());
        message.setChatId(request.getChatId());

        return messageRepository.save(message);
    }

    public Message saveMessage(Message message){
        return messageRepository.save(message);
    }
}
