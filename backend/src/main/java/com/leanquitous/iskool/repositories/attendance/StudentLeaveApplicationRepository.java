package com.leanquitous.iskool.repositories.attendance;

import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

@Repository
public interface StudentLeaveApplicationRepository extends JpaRepository<StudentLeaveApplication, Long> {

    List<StudentLeaveApplication> findBySchoolIdAndStudentId(Long schoolId, Long studentId);

    List<StudentLeaveApplication> findBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);
    long countBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);

    List<StudentLeaveApplication> findBySchoolIdAndStatusOrderByStartDateDesc(Long schoolId, StudentLeaveApplication.LeaveStatus status, Pageable pageable);
}
