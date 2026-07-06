package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.ReportCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportCardRepository extends JpaRepository<ReportCard, Long> {
    Optional<ReportCard> findBySchoolIdAndStudentIdAndBatchId(Long schoolId, Long studentId, Long batchId);
    List<ReportCard> findBySchoolIdAndBatchId(Long schoolId, Long batchId);
}
