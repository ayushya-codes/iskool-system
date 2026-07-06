package com.leanquitous.iskool.repositories.attendance;

import com.leanquitous.iskool.entity.attendance.FacultyLeaveApplication;
import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyLeaveApplicationRepository extends JpaRepository<FacultyLeaveApplication, Long> {

    List<FacultyLeaveApplication> findBySchoolIdAndFacultyId(Long schoolId, Long facultyId);

    List<FacultyLeaveApplication> findBySchoolIdAndStatus(Long schoolId, StudentLeaveApplication.LeaveStatus status);
}
