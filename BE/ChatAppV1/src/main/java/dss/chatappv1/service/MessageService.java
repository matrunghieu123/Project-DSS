    package dss.chatappv1.service;

    import dss.chatappv1.controller.dto.MessageDto;
    import dss.chatappv1.model.Message;
    import dss.chatappv1.repository.MessageRepository;
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
