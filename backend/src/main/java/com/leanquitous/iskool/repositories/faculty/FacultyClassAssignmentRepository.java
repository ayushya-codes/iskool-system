package com.leanquitous.iskool.repositories.faculty;

import com.leanquitous.iskool.entity.faculty.FacultyClassAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyClassAssignmentRepository extends JpaRepository<FacultyClassAssignment, Long> {

    List<FacultyClassAssignment> findBySchoolIdAndFacultyId(Long schoolId, Long facultyId);

    List<FacultyClassAssignment> findBySchoolIdAndDivisionId(Long schoolId, Long divisionId);
}
