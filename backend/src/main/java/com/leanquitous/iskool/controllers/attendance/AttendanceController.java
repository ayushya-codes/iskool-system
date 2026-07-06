package com.leanquitous.iskool.controllers.attendance;

import com.leanquitous.iskool.dto.attendance.AttendanceDtos.*;
import com.leanquitous.iskool.services.attendance.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // ── Attendance Records ──

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<AttendanceRecordResponse> markSingle(@RequestBody MarkAttendanceRequest req) {
        return ResponseEntity.ok(attendanceService.markSingle(req));
    }

    @PostMapping("/mark-bulk")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<AttendanceRecordResponse>> markBulk(@RequestBody BulkMarkAttendanceRequest req) {
        return ResponseEntity.ok(attendanceService.markBulk(req));
    }

    @GetMapping("/division/{divisionId}/date/{date}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<AttendanceRecordResponse>> getByDivisionAndDate(
            @PathVariable Long divisionId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getByDivisionAndDate(divisionId, date));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<AttendanceRecordResponse>> getByStudentRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(attendanceService.getByStudentRange(studentId, from, to));
    }

    @GetMapping("/division/{divisionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<AttendanceRecordResponse>> getByDivisionRange(
            @PathVariable Long divisionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(attendanceService.getByDivisionRange(divisionId, from, to));
    }

    // ── Student Leave ──

    @PostMapping("/student-leave")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PARENT')")
    public ResponseEntity<StudentLeaveResponse> applyStudentLeave(@RequestBody StudentLeaveRequest req) {
        return ResponseEntity.ok(attendanceService.applyStudentLeave(req));
    }

    @GetMapping("/student-leave/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<StudentLeaveResponse>> getStudentLeaves(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentLeaves(studentId));
    }

    @GetMapping("/student-leave/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<StudentLeaveResponse>> getPendingStudentLeaves() {
        return ResponseEntity.ok(attendanceService.getPendingStudentLeaves());
    }

    @PutMapping("/student-leave/{leaveId}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<StudentLeaveResponse> approveStudentLeave(
            @PathVariable Long leaveId, @RequestBody LeaveApprovalRequest req) {
        return ResponseEntity.ok(attendanceService.approveStudentLeave(leaveId, req));
    }

    // ── Faculty Leave ──

    @PostMapping("/faculty-leave")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<FacultyLeaveResponse> applyFacultyLeave(@RequestBody FacultyLeaveRequest req) {
        return ResponseEntity.ok(attendanceService.applyFacultyLeave(req));
    }

    @GetMapping("/faculty-leave/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<FacultyLeaveResponse>> getFacultyLeaves(@PathVariable Long facultyId) {
        return ResponseEntity.ok(attendanceService.getFacultyLeaves(facultyId));
    }

    @GetMapping("/faculty-leave/pending")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<FacultyLeaveResponse>> getPendingFacultyLeaves() {
        return ResponseEntity.ok(attendanceService.getPendingFacultyLeaves());
    }

    @PutMapping("/faculty-leave/{leaveId}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<FacultyLeaveResponse> approveFacultyLeave(
            @PathVariable Long leaveId, @RequestBody LeaveApprovalRequest req) {
        return ResponseEntity.ok(attendanceService.approveFacultyLeave(leaveId, req));
    }
}
