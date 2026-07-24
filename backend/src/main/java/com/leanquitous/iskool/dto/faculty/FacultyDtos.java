package com.leanquitous.iskool.dto.faculty;

import com.leanquitous.iskool.entity.faculty.*;
import com.leanquitous.iskool.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class FacultyDtos {

    // ── Faculty ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class FacultyResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String employeeId;
        private String certifications;
        private Integer maxWeeklyLectures;
        private Long schoolId;

        public static FacultyResponse from(Faculty f) {
            return FacultyResponse.builder()
                    .id(f.getId()).userId(f.getUserId()).employeeId(f.getEmployeeId())
                    .certifications(f.getCertifications())
                    .maxWeeklyLectures(f.getMaxWeeklyLectures())
                    .schoolId(f.getSchoolId())
                    .build();
        }

        public static FacultyResponse from(Faculty f, User u) {
            return FacultyResponse.builder()
                    .id(f.getId()).userId(f.getUserId()).employeeId(f.getEmployeeId())
                    .certifications(f.getCertifications())
                    .maxWeeklyLectures(f.getMaxWeeklyLectures())
                    .schoolId(f.getSchoolId())
                    .fullName(u != null ? u.getFullName() : null)
                    .email(u != null ? u.getEmail() : null)
                    .mobileNumber(u != null ? u.getMobileNumber() : null)
                    .build();
        }
    }

    @Data
    public static class FacultyRequest {
        private Long userId;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String password;
        private String employeeId;
        private String certifications;
        private Integer maxWeeklyLectures;
    }

    // ── Class Assignment ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class ClassAssignmentResponse {
        private Long id;
        private Long facultyId;
        private Long divisionId;
        private Long subjectId;

        public static ClassAssignmentResponse from(FacultyClassAssignment a) {
            return ClassAssignmentResponse.builder()
                    .id(a.getId()).facultyId(a.getFacultyId())
                    .divisionId(a.getDivisionId()).subjectId(a.getSubjectId())
                    .build();
        }
    }

    @Data
    public static class ClassAssignmentRequest {
        private Long divisionId;
        private Long subjectId;
    }

    // ── Attendance ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class FacultyAttendanceResponse {
        private Long id;
        private Long facultyId;
        private LocalDate date;
        private LocalTime clockIn;
        private LocalTime clockOut;

        public static FacultyAttendanceResponse from(FacultyAttendance a) {
            return FacultyAttendanceResponse.builder()
                    .id(a.getId()).facultyId(a.getFacultyId()).date(a.getDate())
                    .clockIn(a.getClockIn()).clockOut(a.getClockOut())
                    .build();
        }
    }

    @Data
    public static class ClockInRequest {
        private LocalDate date;
        private LocalTime clockIn;
    }

    @Data
    public static class ClockOutRequest {
        private LocalTime clockOut;
    }

    // ── Availability ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class AvailabilityResponse {
        private Long id;
        private Long facultyId;
        private Integer dayOfWeek;
        private LocalTime availableFrom;
        private LocalTime availableTo;
        private Boolean isPreferredSlot;
        private String notes;

        public static AvailabilityResponse from(FacultyAvailability a) {
            return AvailabilityResponse.builder()
                    .id(a.getId()).facultyId(a.getFacultyId()).dayOfWeek(a.getDayOfWeek())
                    .availableFrom(a.getAvailableFrom()).availableTo(a.getAvailableTo())
                    .isPreferredSlot(a.getIsPreferredSlot()).notes(a.getNotes())
                    .build();
        }
    }

    @Data
    public static class AvailabilityRequest {
        private Integer dayOfWeek;
        private LocalTime availableFrom;
        private LocalTime availableTo;
        private Boolean isPreferredSlot;
        private String notes;
    }
}
