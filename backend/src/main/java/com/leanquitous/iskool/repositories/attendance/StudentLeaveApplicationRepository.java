package com.leanquitous.iskool.repositories.attendance;

import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentLeaveApplicationRepository extends JpaRepository<StudentLeaveApplication, Long> {

    List<StudentLeaveApplication> findBySchoolIdAndStudentId(Long schoolId, Long studentId);

    List<StudentLeaveApplication> findBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);
}
