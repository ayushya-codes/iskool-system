package com.leanquitous.iskool.dto.helpdesk;

import com.leanquitous.iskool.entity.helpdesk.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class HelpdeskDtos {

    // ── Ticket ──
    @Data @Builder @AllArgsConstructor
    public static class TicketResponse {
        private Long id; private Long studentId; private Long raisedByUserId; private String subject;
        private String description; private HelpdeskTicket.TicketStatus status; private Long assignedToUserId;
        public static TicketResponse from(HelpdeskTicket t) {
            return TicketResponse.builder().id(t.getId()).studentId(t.getStudentId()).raisedByUserId(t.getRaisedByUserId())
                    .subject(t.getSubject()).description(t.getDescription()).status(t.getStatus()).assignedToUserId(t.getAssignedToUserId()).build();
        }
    }
    @Data
    public static class TicketRequest {
        private Long studentId; private Long raisedByUserId; private String subject; private String description;
    }

    // ── Reply ──
    @Data @Builder @AllArgsConstructor
    public static class ReplyResponse {
        private Long id; private Long ticketId; private Long repliedByUserId; private String message;
        public static ReplyResponse from(HelpdeskTicketReply r) {
            return ReplyResponse.builder().id(r.getId()).ticketId(r.getTicketId()).repliedByUserId(r.getRepliedByUserId()).message(r.getMessage()).build();
        }
    }
    @Data
    public static class ReplyRequest {
        private Long ticketId; private Long repliedByUserId; private String message;
    }
}
