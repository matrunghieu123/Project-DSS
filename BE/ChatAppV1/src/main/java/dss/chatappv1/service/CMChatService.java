package dss.chatappv1.service;

import dss.chatappv1.model.CMChat;
import dss.chatappv1.repository.CMChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CMChatService {

    @Autowired
    private CMChatRepository cmChatRepository;

    public CMChat createCMChat(CMChat cmChat) {
        cmChat.setCreated(LocalDateTime.now());
        cmChat.setIsActive("Y");
        cmChat.setIsDeleted("N");
        return cmChatRepository.save(cmChat);
    }

    public CMChat findMessageById(Long id){
        return cmChatRepository.findCMChatByCmChatId(id);
    }

    public Page<CMChat> getMessagesByChatId(Long chatId, Pageable pageable) {
        return cmChatRepository.findBycmChatId(chatId, pageable);
    }

    public Page<CMChat> getMessagesBetweenUsers(String sender, Pageable pageable) {
        return cmChatRepository.findBySocialName(sender, pageable);
    }

    public CMChat updateMessageStatus(CMChat updatedMessage) {
        Optional<CMChat> existingMessage = cmChatRepository.findById(updatedMessage.getCmChatId());

        if (existingMessage.isPresent()) {
            CMChat message = existingMessage.get();
            message.setIStatus(updatedMessage.getIStatus());  // Update status
            message.setUpdated(LocalDateTime.now());
            return cmChatRepository.save(message);
        }
        return null;
    }
}

