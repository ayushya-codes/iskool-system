package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {

    List<StudentEnrollment> findBySchoolIdAndBatchId(Long schoolId, Long batchId);

    List<StudentEnrollment> findBySchoolIdAndDivisionIdAndBatchId(Long schoolId, Long divisionId, Long batchId);

    Optional<StudentEnrollment> findBySchoolIdAndStudentIdAndBatchId(Long schoolId, Long studentId, Long batchId);

    List<StudentEnrollment> findBySchoolIdAndStudentId(Long schoolId, Long studentId);

    List<StudentEnrollment> findBySchoolIdAndDivisionIdIn(Long schoolId, List<Long> divisionIds);

    List<StudentEnrollment> findBySchoolIdAndDivisionIdInAndBatchId(Long schoolId, List<Long> divisionIds, Long batchId);
}
