package com.leanquitous.iskool.controllers.helpdesk;

import com.leanquitous.iskool.dto.helpdesk.HelpdeskDtos.*;
import com.leanquitous.iskool.entity.helpdesk.HelpdeskTicket;
import com.leanquitous.iskool.services.helpdesk.HelpdeskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/helpdesk")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class HelpdeskController {

    private final HelpdeskService helpdeskService;

    @PostMapping("/tickets")
    public ResponseEntity<TicketResponse> createTicket(@RequestBody TicketRequest req) {
        return ResponseEntity.ok(helpdeskService.createTicket(req));
    }

    @GetMapping("/tickets/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'PARENT')")
    public ResponseEntity<List<TicketResponse>> getTicketsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(helpdeskService.getTicketsByStudent(studentId));
    }

    @GetMapping("/tickets/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'HELPDESK')")
    public ResponseEntity<List<TicketResponse>> getTicketsByStatus(@PathVariable HelpdeskTicket.TicketStatus status) {
        return ResponseEntity.ok(helpdeskService.getTicketsByStatus(status));
    }

    @PutMapping("/tickets/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'HELPDESK')")
    public ResponseEntity<TicketResponse> assignTicket(@PathVariable Long id, @RequestParam Long assignedToUserId) {
        return ResponseEntity.ok(helpdeskService.assignTicket(id, assignedToUserId));
    }

    @PutMapping("/tickets/{id}/resolve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'HELPDESK')")
    public ResponseEntity<TicketResponse> resolveTicket(@PathVariable Long id) {
        return ResponseEntity.ok(helpdeskService.resolveTicket(id));
    }

    @PostMapping("/replies")
    public ResponseEntity<ReplyResponse> addReply(@RequestBody ReplyRequest req) {
        return ResponseEntity.ok(helpdeskService.addReply(req));
    }

    @GetMapping("/tickets/{ticketId}/replies")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'HELPDESK', 'PARENT')")
    public ResponseEntity<List<ReplyResponse>> getReplies(@PathVariable Long ticketId) {
        return ResponseEntity.ok(helpdeskService.getReplies(ticketId));
    }
}
