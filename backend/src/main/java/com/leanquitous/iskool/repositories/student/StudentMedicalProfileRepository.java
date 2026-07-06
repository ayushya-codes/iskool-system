package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.StudentMedicalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentMedicalProfileRepository extends JpaRepository<StudentMedicalProfile, Long> {

    Optional<StudentMedicalProfile> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
}
