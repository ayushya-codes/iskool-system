package com.leanquitous.iskool.repositories.finance;

import com.leanquitous.iskool.entity.finance.Invoice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
    List<Invoice> findBySchoolIdAndBatchId(Long schoolId, Long batchId);
    List<Invoice> findBySchoolIdAndStatus(Long schoolId, Invoice.InvoiceStatus status);
    long countBySchoolIdAndStatus(Long schoolId, Invoice.InvoiceStatus status);
    List<Invoice> findBySchoolIdAndStatusOrderByDueDateDesc(Long schoolId, Invoice.InvoiceStatus status, Pageable pageable);
}
