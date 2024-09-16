package com.dss.chatapp.service;

import com.dss.chatapp.model.Message;
import com.dss.chatapp.repository.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    MessageRepo messageRepo;

    public MessageService(){}

    public List<Message>getMessage(){
        return messageRepo.findAll();
    }

    public List<Message>getAllMessageById(Iterable id){
        return messageRepo.findAllById(id);
    }
    public Message save(Message message) {return messageRepo.save(message);}
}
