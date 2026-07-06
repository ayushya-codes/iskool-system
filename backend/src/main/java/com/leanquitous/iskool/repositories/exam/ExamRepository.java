package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findBySchoolIdAndBatchIdOrderByExamDateAsc(Long schoolId, Long batchId);
    List<Exam> findBySchoolIdAndDivisionIdOrderByExamDateAsc(Long schoolId, Long divisionId);
    List<Exam> findBySchoolIdAndBatchIdAndIsActiveTrueOrderByExamDateAsc(Long schoolId, Long batchId);
    List<Exam> findBySchoolIdAndDivisionIdAndIsActiveTrueOrderByExamDateAsc(Long schoolId, Long divisionId);
}
