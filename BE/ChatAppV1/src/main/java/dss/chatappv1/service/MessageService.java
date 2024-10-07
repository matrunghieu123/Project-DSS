    package dss.chatappv1.service;


    import dss.chatappv1.controller.dto.MessageDto;
    import dss.chatappv1.model.Message;
    import dss.chatappv1.repository.MessageRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.stereotype.Service;

    import java.util.List;

    @Service
    public class MessageService {

        @Autowired
        private MessageRepository messageRepository;

        public Message createMessage(Message request){
            Message message = new Message();
            message.setMessage(request.getMessage());
            message.setTime(request.getTime());
            message.setFileUrl(request.getFileUrl());
            message.setFileType(request.getFileType());
            message.setStatus(request.getStatus());
            message.setSenderName(request.getSenderName());
            message.setReceiverName(request.getReceiverName());
            message.setChatId(request.getChatId());

            return messageRepository.save(message);
        }

        public Message updateMessageStatus(Message updateMessage) {
            Message message = messageRepository.findById(updateMessage.getMessage_id())
                    .orElseThrow(() -> new RuntimeException("Message not found"));

            message.setStatus(updateMessage.getStatus());
            return messageRepository.save(message);
        }

        public Page<Message> getMessagesByChatId(Long chatId, Pageable pageable) {
            return messageRepository.findByChatIdOrderByTimeAsc(chatId, pageable);
        }

        public Page<Message> getMessagesBetweenUsers(String senderName, String receiverName, Pageable pageable) {
            return messageRepository.findMessagesBetweenUsers(senderName, receiverName, pageable);
        }

        public Page<Message> getMessageByPublicChat(Pageable pageable){
            return messageRepository.findMessagesByReceiverPublic(pageable);
        }
    }
