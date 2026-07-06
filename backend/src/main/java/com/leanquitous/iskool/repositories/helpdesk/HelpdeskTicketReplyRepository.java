package com.leanquitous.iskool.repositories.helpdesk;

import com.leanquitous.iskool.entity.helpdesk.HelpdeskTicketReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpdeskTicketReplyRepository extends JpaRepository<HelpdeskTicketReply, Long> {
    List<HelpdeskTicketReply> findBySchoolIdAndTicketId(Long schoolId, Long ticketId);
}
