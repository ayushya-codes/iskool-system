package com.leanquitous.iskool.entity.helpdesk;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "helpdesk_ticket_replies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class HelpdeskTicketReply extends BaseEntity {

    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;

    @Column(name = "replied_by_user_id", nullable = false)
    private Long repliedByUserId;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
}
