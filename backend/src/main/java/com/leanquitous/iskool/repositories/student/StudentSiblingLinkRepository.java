package com.leanquitous.iskool.repositories.student;

import com.leanquitous.iskool.entity.student.StudentSiblingLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSiblingLinkRepository extends JpaRepository<StudentSiblingLink, Long> {

    List<StudentSiblingLink> findBySchoolIdAndStudentId(Long schoolId, Long studentId);
}
