package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.ExamPortion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamPortionRepository extends JpaRepository<ExamPortion, Long> {
    List<ExamPortion> findBySchoolIdAndExamId(Long schoolId, Long examId);
}
