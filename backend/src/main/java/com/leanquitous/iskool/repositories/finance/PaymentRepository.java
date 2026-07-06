package com.leanquitous.iskool.repositories.finance;

import com.leanquitous.iskool.entity.finance.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findBySchoolIdAndInvoiceId(Long schoolId, Long invoiceId);
}
