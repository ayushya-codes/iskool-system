package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.StudentEmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentEmergencyContactRepository extends JpaRepository<StudentEmergencyContact, Long> {

    List<StudentEmergencyContact> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
}
