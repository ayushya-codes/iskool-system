package com.leanquitous.iskool.repositories.coursework;

import com.leanquitous.iskool.entity.coursework.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findBySchoolIdAndDivisionIdOrderByDueDateDesc(Long schoolId, Long divisionId);
    List<Assignment> findBySchoolIdAndCreatedByFacultyIdOrderByDueDateDesc(Long schoolId, Long facultyId);
    List<Assignment> findBySchoolIdAndDivisionIdInOrderByDueDateDesc(Long schoolId, List<Long> divisionIds);
}
