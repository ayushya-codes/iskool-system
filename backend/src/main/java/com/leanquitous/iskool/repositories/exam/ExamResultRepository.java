package com.leanquitous.iskool.repositories.exam;

import com.leanquitous.iskool.entity.exam.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findBySchoolIdAndExamId(Long schoolId, Long examId);
    List<ExamResult> findBySchoolIdAndExamIdAndStudentId(Long schoolId, Long examId, Long studentId);
}
