package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findBySchoolIdAndAssignmentId(Long schoolId, Long assignmentId);
    List<AssignmentSubmission> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
}
