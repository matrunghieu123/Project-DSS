package dss.chatappv1.repository;

import dss.chatappv1.model.CMChat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface CMChatRepository extends JpaRepository<CMChat, Long> {
    Page<CMChat> findBycmChatId(Long cmChatId, Pageable pageable);

    CMChat findCMChatByCmChatId(Long cmChatId);

    Page<CMChat> findBySocialName(String socialName, Pageable pageable);
}
