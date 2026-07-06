package com.leanquitous.iskool.repositories.helpdesk;

import com.leanquitous.iskool.entity.helpdesk.HelpdeskTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpdeskTicketRepository extends JpaRepository<HelpdeskTicket, Long> {
    List<HelpdeskTicket> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
    List<HelpdeskTicket> findBySchoolIdAndStatus(Long schoolId, HelpdeskTicket.TicketStatus status);
}
