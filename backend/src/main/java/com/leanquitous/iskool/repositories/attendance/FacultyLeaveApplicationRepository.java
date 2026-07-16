package com.leanquitous.iskool.repositories.attendance;

import com.leanquitous.iskool.entity.attendance.FacultyLeaveApplication;
import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;

@Repository
public interface FacultyLeaveApplicationRepository extends JpaRepository<FacultyLeaveApplication, Long> {

    List<FacultyLeaveApplication> findBySchoolIdAndFacultyId(Long schoolId, Long facultyId);

    List<FacultyLeaveApplication> findBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);
    long countBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);

    List<FacultyLeaveApplication> findBySchoolIdAndStatusOrderByStartDateDesc(Long schoolId, StudentLeaveApplication.LeaveStatus status, Pageable pageable);
}
