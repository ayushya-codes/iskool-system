package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findBySchoolIdAndIsActiveTrueOrderByFirstNameAsc(Long schoolId);

    Optional<Student> findByParentUserIdAndSchoolIdAndIsActiveTrue(Long parentUserId, Long schoolId);

    List<Student> findByParentUserIdAndSchoolIdAndIsActiveTrueOrderByFirstNameAsc(Long parentUserId, Long schoolId);

    List<Student> findBySchoolIdOrderByFirstNameAsc(Long schoolId);

    Optional<Student> findByParentUserIdAndSchoolId(Long parentUserId, Long schoolId);
}
