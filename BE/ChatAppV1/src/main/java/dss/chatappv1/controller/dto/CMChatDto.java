package dss.chatappv1.controller.dto;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CMChatDto implements Serializable {
    private Long id;
    private Long adClientId;
    private Long adOrgId;
    private Long cmCustomerId;
    private String contentText;
    private String created;
    private String createdBy;
    private String isActive;
    private String isDeleted;
    private String updated;
    private String updatedBy;
    private String dataType;
    private String isReceive;
    private Long iStatus;
    private String channel;
    private String socialName;

    // Getters and Setters
}
