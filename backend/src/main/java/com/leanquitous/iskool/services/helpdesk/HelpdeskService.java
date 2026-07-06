package com.leanquitous.iskool.services.helpdesk;

import com.leanquitous.iskool.dto.helpdesk.HelpdeskDtos.*;
import com.leanquitous.iskool.entity.helpdesk.*;
import com.leanquitous.iskool.repositories.helpdesk.*;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HelpdeskService {

    private final HelpdeskTicketRepository ticketRepo;
    private final HelpdeskTicketReplyRepository replyRepo;

    public TicketResponse createTicket(TicketRequest req) {
        HelpdeskTicket ticket = HelpdeskTicket.builder().studentId(req.getStudentId()).raisedByUserId(req.getRaisedByUserId())
                .subject(req.getSubject()).description(req.getDescription()).status(HelpdeskTicket.TicketStatus.OPEN)
                .schoolId(TenantContext.getCurrentTenant()).build();
        return TicketResponse.from(ticketRepo.save(ticket));
    }

    public List<TicketResponse> getTicketsByStudent(Long studentId) {
        return ticketRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(TicketResponse::from).toList();
    }

    public List<TicketResponse> getTicketsByStatus(HelpdeskTicket.TicketStatus status) {
        return ticketRepo.findBySchoolIdAndStatus(TenantContext.getCurrentTenant(), status)
                .stream().map(TicketResponse::from).toList();
    }

    public TicketResponse assignTicket(Long id, Long assignedToUserId) {
        HelpdeskTicket ticket = ticketRepo.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        TenantValidator.validateOwnership(ticket.getSchoolId());
        ticket.setAssignedToUserId(assignedToUserId);
        return TicketResponse.from(ticketRepo.save(ticket));
    }

    public TicketResponse resolveTicket(Long id) {
        HelpdeskTicket ticket = ticketRepo.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        TenantValidator.validateOwnership(ticket.getSchoolId());
        ticket.setStatus(HelpdeskTicket.TicketStatus.RESOLVED);
        return TicketResponse.from(ticketRepo.save(ticket));
    }

    public ReplyResponse addReply(ReplyRequest req) {
        HelpdeskTicketReply reply = HelpdeskTicketReply.builder().ticketId(req.getTicketId())
                .repliedByUserId(req.getRepliedByUserId()).message(req.getMessage())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return ReplyResponse.from(replyRepo.save(reply));
    }

    public List<ReplyResponse> getReplies(Long ticketId) {
        return replyRepo.findBySchoolIdAndTicketId(TenantContext.getCurrentTenant(), ticketId)
                .stream().map(ReplyResponse::from).toList();
    }
}
