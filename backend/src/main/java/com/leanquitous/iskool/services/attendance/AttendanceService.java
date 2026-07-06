package com.leanquitous.iskool.services.attendance;

import com.leanquitous.iskool.dto.attendance.AttendanceDtos.*;
import com.leanquitous.iskool.entity.attendance.*;
import com.leanquitous.iskool.repositories.attendance.*;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRepo;
    private final StudentLeaveApplicationRepository studentLeaveRepo;
    private final FacultyLeaveApplicationRepository facultyLeaveRepo;

    // ── Attendance Records ──

    public AttendanceRecordResponse markSingle(MarkAttendanceRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        AttendanceRecord record = attendanceRepo
                .findBySchoolIdAndStudentIdAndDate(schoolId, req.getStudentId(), req.getDate())
                .orElseGet(() -> AttendanceRecord.builder()
                        .studentId(req.getStudentId())
                        .divisionId(req.getDivisionId())
                        .date(req.getDate())
                        .schoolId(schoolId)
                        .build());
        record.setStatus(req.getStatus());
        record.setMarkedByFacultyId(req.getMarkedByFacultyId());
        return AttendanceRecordResponse.from(attendanceRepo.save(record));
    }

    public List<AttendanceRecordResponse> markBulk(BulkMarkAttendanceRequest req) {
        return req.getEntries().stream().map(entry -> {
            MarkAttendanceRequest single = new MarkAttendanceRequest();
            single.setStudentId(entry.getStudentId());
            single.setDivisionId(req.getDivisionId());
            single.setDate(req.getDate());
            single.setStatus(entry.getStatus());
            single.setMarkedByFacultyId(req.getMarkedByFacultyId());
            return markSingle(single);
        }).toList();
    }

    public List<AttendanceRecordResponse> getByDivisionAndDate(Long divisionId, LocalDate date) {
        return attendanceRepo.findBySchoolIdAndDivisionIdAndDate(TenantContext.getCurrentTenant(), divisionId, date)
                .stream().map(AttendanceRecordResponse::from).toList();
    }

    public List<AttendanceRecordResponse> getByStudentRange(Long studentId, LocalDate from, LocalDate to) {
        return attendanceRepo.findBySchoolIdAndStudentIdAndDateBetween(
                        TenantContext.getCurrentTenant(), studentId, from, to)
                .stream().map(AttendanceRecordResponse::from).toList();
    }

    public List<AttendanceRecordResponse> getByDivisionRange(Long divisionId, LocalDate from, LocalDate to) {
        return attendanceRepo.findBySchoolIdAndDivisionIdAndDateBetween(
                        TenantContext.getCurrentTenant(), divisionId, from, to)
                .stream().map(AttendanceRecordResponse::from).toList();
    }

    // ── Student Leave ──

    public StudentLeaveResponse applyStudentLeave(StudentLeaveRequest req) {
        StudentLeaveApplication leave = StudentLeaveApplication.builder()
                .studentId(req.getStudentId())
                .leaveType(req.getLeaveType())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .reason(req.getReason())
                .status(StudentLeaveApplication.LeaveStatus.PENDING)
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return StudentLeaveResponse.from(studentLeaveRepo.save(leave));
    }

    public List<StudentLeaveResponse> getStudentLeaves(Long studentId) {
        return studentLeaveRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(StudentLeaveResponse::from).toList();
    }

    public List<StudentLeaveResponse> getPendingStudentLeaves() {
        return studentLeaveRepo.findBySchoolIdAndStatus(
                        TenantContext.getCurrentTenant(), StudentLeaveApplication.LeaveStatus.PENDING)
                .stream().map(StudentLeaveResponse::from).toList();
    }

    public StudentLeaveResponse approveStudentLeave(Long leaveId, LeaveApprovalRequest req) {
        StudentLeaveApplication leave = studentLeaveRepo.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave application not found"));
        leave.setStatus(req.getStatus());
        leave.setApprovedByUserId(req.getApprovedByUserId());
        return StudentLeaveResponse.from(studentLeaveRepo.save(leave));
    }

    // ── Faculty Leave ──

    public FacultyLeaveResponse applyFacultyLeave(FacultyLeaveRequest req) {
        FacultyLeaveApplication leave = FacultyLeaveApplication.builder()
                .facultyId(req.getFacultyId())
                .leaveType(req.getLeaveType())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .reason(req.getReason())
                .status(StudentLeaveApplication.LeaveStatus.PENDING)
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return FacultyLeaveResponse.from(facultyLeaveRepo.save(leave));
    }

    public List<FacultyLeaveResponse> getFacultyLeaves(Long facultyId) {
        return facultyLeaveRepo.findBySchoolIdAndFacultyId(TenantContext.getCurrentTenant(), facultyId)
                .stream().map(FacultyLeaveResponse::from).toList();
    }

    public List<FacultyLeaveResponse> getPendingFacultyLeaves() {
        return facultyLeaveRepo.findBySchoolIdAndStatus(
                        TenantContext.getCurrentTenant(), StudentLeaveApplication.LeaveStatus.PENDING)
                .stream().map(FacultyLeaveResponse::from).toList();
    }

    public FacultyLeaveResponse approveFacultyLeave(Long leaveId, LeaveApprovalRequest req) {
        FacultyLeaveApplication leave = facultyLeaveRepo.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave application not found"));
        leave.setStatus(req.getStatus());
        leave.setApprovedByUserId(req.getApprovedByUserId());
        return FacultyLeaveResponse.from(facultyLeaveRepo.save(leave));
    }
}
