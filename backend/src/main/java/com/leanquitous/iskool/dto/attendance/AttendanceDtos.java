package com.leanquitous.iskool.dto.attendance;

import com.leanquitous.iskool.entity.attendance.AttendanceRecord;
import com.leanquitous.iskool.entity.attendance.FacultyLeaveApplication;
import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class AttendanceDtos {

    // ── Attendance Record ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class AttendanceRecordResponse {
        private Long id;
        private Long studentId;
        private Long divisionId;
        private LocalDate date;
        private AttendanceRecord.AttendanceStatus status;
        private Long markedByFacultyId;

        public static AttendanceRecordResponse from(AttendanceRecord r) {
            return AttendanceRecordResponse.builder()
                    .id(r.getId()).studentId(r.getStudentId()).divisionId(r.getDivisionId())
                    .date(r.getDate()).status(r.getStatus()).markedByFacultyId(r.getMarkedByFacultyId())
                    .build();
        }
    }

    @Data
    public static class MarkAttendanceRequest {
        private Long studentId;
        private Long divisionId;
        private LocalDate date;
        private AttendanceRecord.AttendanceStatus status;
        private Long markedByFacultyId;
    }

    @Data
    public static class BulkMarkAttendanceRequest {
        private Long divisionId;
        private LocalDate date;
        private Long markedByFacultyId;
        private List<StudentAttendanceEntry> entries;
    }

    @Data
    public static class StudentAttendanceEntry {
        private Long studentId;
        private AttendanceRecord.AttendanceStatus status;
    }

    // ── Student Leave ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class StudentLeaveResponse {
        private Long id;
        private Long studentId;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private StudentLeaveApplication.LeaveStatus status;
        private Long approvedByUserId;

        public static StudentLeaveResponse from(StudentLeaveApplication l) {
            return StudentLeaveResponse.builder()
                    .id(l.getId()).studentId(l.getStudentId()).leaveType(l.getLeaveType())
                    .startDate(l.getStartDate()).endDate(l.getEndDate()).reason(l.getReason())
                    .status(l.getStatus()).approvedByUserId(l.getApprovedByUserId())
                    .build();
        }
    }

    @Data
    public static class StudentLeaveRequest {
        private Long studentId;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }

    // ── Faculty Leave ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class FacultyLeaveResponse {
        private Long id;
        private Long facultyId;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private StudentLeaveApplication.LeaveStatus status;
        private Long approvedByUserId;

        public static FacultyLeaveResponse from(FacultyLeaveApplication l) {
            return FacultyLeaveResponse.builder()
                    .id(l.getId()).facultyId(l.getFacultyId()).leaveType(l.getLeaveType())
                    .startDate(l.getStartDate()).endDate(l.getEndDate()).reason(l.getReason())
                    .status(l.getStatus()).approvedByUserId(l.getApprovedByUserId())
                    .build();
        }
    }

    @Data
    public static class FacultyLeaveRequest {
        private Long facultyId;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
    }

    @Data
    public static class LeaveApprovalRequest {
        private StudentLeaveApplication.LeaveStatus status;
        private Long approvedByUserId;
    }
}
