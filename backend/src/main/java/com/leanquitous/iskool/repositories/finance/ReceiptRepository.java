package com.leanquitous.iskool.repositories.finance;

import com.leanquitous.iskool.entity.finance.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Optional<Receipt> findBySchoolIdAndPaymentId(Long schoolId, Long paymentId);
}
