package dss.chatappv1.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Table(name = "CM_CHAT") // Đặt tên bảng theo yêu cầu
public class CMChat {

    // ID tự tăng, sử dụng kiểu Long cho cột CM_CHAT_ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cm_chat_id")
    private Long cmChatId;

    @Column(name = "ad_client_id", nullable = false)
    private Long adClientId = 85L;

    @Column(name = "ad_org_id", nullable = false)
    private Long adOrgId = 105L;

    @Column(name = "cm_customer_id", nullable = true)
    private Long cmCustomerId = 434L;

    @Column(name = "contenttext", length = 500)
    private String contentText;

    @Column(name = "created", columnDefinition = "timestamp without time zone")
    private LocalDateTime created;

    @Column(name = "createdby", nullable = false)
    private Long createdBy = 1050137L;

    @Column(name = "isactive", length = 1)
    private String isActive = "Y";

    @Column(name = "isdeleted", length = 1)
    private String isDeleted = "N";

    @Column(name = "updated", columnDefinition = "timestamp without time zone")
    private LocalDateTime updated;

    @Column(name = "updatedby", nullable = false)
    private Long updatedBy = 1050137L;

    @Column(name = "datatype", length = 10)
    private String dataType;

    @Column(name = "isreceive", length = 1)
    private String isReceive;

    @Column(name = "istatus", nullable = false)
    private Long iStatus;

    @Column(name = "channel", length = 20)
    private String channel;

    @Column(name = "socialname", length = 200)
    private String socialName;
}
