package com.leanquitous.iskool.dto.student;

import com.leanquitous.iskool.entity.student.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class StudentDtos {

    // ── Student ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class StudentResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String gender;
        private String avatarUrl;
        private LocalDate admissionDate;
        private Long schoolId;
        private Long parentUserId;

        public static StudentResponse from(Student s) {
            return StudentResponse.builder()
                    .id(s.getId()).firstName(s.getFirstName()).lastName(s.getLastName())
                    .dateOfBirth(s.getDateOfBirth()).gender(s.getGender())
                    .avatarUrl(s.getAvatarUrl()).admissionDate(s.getAdmissionDate())
                    .schoolId(s.getSchoolId())
                    .parentUserId(s.getParentUserId())
                    .build();
        }
    }

    @Data
    public static class StudentRequest {
        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String gender;
        private String avatarUrl;
        private LocalDate admissionDate;
        private Long parentUserId;
        private String parentEmail;
        private String parentName;
        private String parentMobile;
    }

    // ── Student Detail (with related data) ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class StudentDetailResponse {
        private StudentResponse student;
        private MedicalResponse medical;
        private List<EmergencyContactResponse> emergencyContacts;
        private List<EnrollmentResponse> enrollments;
        private List<TimelineResponse> timeline;
    }

    // ── Medical ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class MedicalResponse {
        private Long id;
        private Long studentId;
        private String bloodGroup;
        private String allergies;
        private Boolean asthma;
        private String chronicConditions;
        private String medications;
        private String doctorNotes;

        public static MedicalResponse from(StudentMedicalProfile m) {
            return MedicalResponse.builder()
                    .id(m.getId()).studentId(m.getStudentId())
                    .bloodGroup(m.getBloodGroup()).allergies(m.getAllergies())
                    .asthma(m.getAsthma()).chronicConditions(m.getChronicConditions())
                    .medications(m.getMedications()).doctorNotes(m.getDoctorNotes())
                    .build();
        }
    }

    @Data
    public static class MedicalRequest {
        private String bloodGroup;
        private String allergies;
        private Boolean asthma;
        private String chronicConditions;
        private String medications;
        private String doctorNotes;
    }

    // ── Enrollment ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class EnrollmentResponse {
        private Long id;
        private Long studentId;
        private Long divisionId;
        private Long batchId;
        private String rollNumber;

        public static EnrollmentResponse from(StudentEnrollment e) {
            return EnrollmentResponse.builder()
                    .id(e.getId()).studentId(e.getStudentId())
                    .divisionId(e.getDivisionId()).batchId(e.getBatchId())
                    .rollNumber(e.getRollNumber())
                    .build();
        }
    }

    @Data
    public static class EnrollmentRequest {
        private Long divisionId;
        private Long batchId;
        private String rollNumber;
    }

    // ── Emergency Contact ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class EmergencyContactResponse {
        private Long id;
        private Long studentId;
        private String contactName;
        private String relationship;
        private String phoneNumber;
        private Boolean isPrimary;

        public static EmergencyContactResponse from(StudentEmergencyContact c) {
            return EmergencyContactResponse.builder()
                    .id(c.getId()).studentId(c.getStudentId())
                    .contactName(c.getContactName()).relationship(c.getRelationship())
                    .phoneNumber(c.getPhoneNumber()).isPrimary(c.getIsPrimary())
                    .build();
        }
    }

    @Data
    public static class EmergencyContactRequest {
        private String contactName;
        private String relationship;
        private String phoneNumber;
        private Boolean isPrimary;
    }

    // ── Timeline ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class TimelineResponse {
        private Long id;
        private Long studentId;
        private String eventType;
        private LocalDate eventDate;
        private String title;
        private String description;

        public static TimelineResponse from(StudentTimeline t) {
            return TimelineResponse.builder()
                    .id(t.getId()).studentId(t.getStudentId())
                    .eventType(t.getEventType()).eventDate(t.getEventDate())
                    .title(t.getTitle()).description(t.getDescription())
                    .build();
        }
    }

    @Data
    public static class TimelineRequest {
        private String eventType;
        private LocalDate eventDate;
        private String title;
        private String description;
    }

    // ── Sibling Link ──

    @Data
    public static class SiblingLinkRequest {
        private Long siblingStudentId;
    }
}
