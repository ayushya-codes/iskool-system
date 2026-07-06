package com.leanquitous.iskool.dto.coursework;

import com.leanquitous.iskool.entity.coursework.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class CourseworkDtos {

    // ── ClassTimetable ──
    @Data @Builder @AllArgsConstructor
    public static class TimetableResponse {
        private Long id; private Long classId; private Long batchId;
        private String name; private Boolean isShared; private Boolean isPublished;
        public static TimetableResponse from(ClassTimetable t) {
            return TimetableResponse.builder().id(t.getId()).classId(t.getClassId()).batchId(t.getBatchId())
                    .name(t.getName()).isShared(t.getIsShared()).isPublished(t.getIsPublished()).build();
        }
    }
    @Data
    public static class TimetableRequest {
        private Long classId; private Long batchId; private String name; private Boolean isShared;
    }

    // ── TimetableSlot ──
    @Data @Builder @AllArgsConstructor
    public static class SlotResponse {
        private Long id; private Long timetableId; private Long divisionId;
        private Integer dayOfWeek; private Integer periodNumber;
        private Long subjectId; private Long facultyId; private Long roomId;
        private LocalTime startTime; private LocalTime endTime; private TimetableSlot.SlotType slotType;
        public static SlotResponse from(TimetableSlot s) {
            return SlotResponse.builder().id(s.getId()).timetableId(s.getTimetableId()).divisionId(s.getDivisionId())
                    .dayOfWeek(s.getDayOfWeek()).periodNumber(s.getPeriodNumber()).subjectId(s.getSubjectId())
                    .facultyId(s.getFacultyId()).roomId(s.getRoomId()).startTime(s.getStartTime())
                    .endTime(s.getEndTime()).slotType(s.getSlotType()).build();
        }
    }
    @Data
    public static class SlotRequest {
        private Long timetableId; private Long divisionId; private Integer dayOfWeek;
        private Integer periodNumber; private Long subjectId; private Long facultyId; private Long roomId;
        private LocalTime startTime; private LocalTime endTime; private TimetableSlot.SlotType slotType;
    }

    // ── Room ──
    @Data @Builder @AllArgsConstructor
    public static class RoomResponse {
        private Long id; private String name; private Room.RoomType roomType; private Integer capacity;
        public static RoomResponse from(Room r) {
            return RoomResponse.builder().id(r.getId()).name(r.getName()).roomType(r.getRoomType()).capacity(r.getCapacity()).build();
        }
    }
    @Data
    public static class RoomRequest {
        private String name; private Room.RoomType roomType; private Integer capacity;
    }

    // ── SubjectPeriodRequirement ──
    @Data @Builder @AllArgsConstructor
    public static class PeriodRequirementResponse {
        private Long id; private Long divisionId; private Long subjectId; private Long batchId;
        private Integer periodsPerWeek; private Boolean requiresLab; private Integer preferredDaySpread;
        public static PeriodRequirementResponse from(SubjectPeriodRequirement r) {
            return PeriodRequirementResponse.builder().id(r.getId()).divisionId(r.getDivisionId())
                    .subjectId(r.getSubjectId()).batchId(r.getBatchId()).periodsPerWeek(r.getPeriodsPerWeek())
                    .requiresLab(r.getRequiresLab()).preferredDaySpread(r.getPreferredDaySpread()).build();
        }
    }
    @Data
    public static class PeriodRequirementRequest {
        private Long divisionId; private Long subjectId; private Long batchId;
        private Integer periodsPerWeek; private Boolean requiresLab; private Integer preferredDaySpread;
    }

    // ── TimetableGenerationRequest ──
    @Data @Builder @AllArgsConstructor
    public static class GenerationRequestResponse {
        private Long id; private Long classId; private Long batchId; private Long generatedByUserId;
        private TimetableGenerationRequest.GenerationStatus status; private String aiModelUsed;
        private String requestPayload; private String responsePayload; private String errorMessage;
        public static GenerationRequestResponse from(TimetableGenerationRequest r) {
            return GenerationRequestResponse.builder().id(r.getId()).classId(r.getClassId()).batchId(r.getBatchId())
                    .generatedByUserId(r.getGeneratedByUserId()).status(r.getStatus()).aiModelUsed(r.getAiModelUsed())
                    .requestPayload(r.getRequestPayload()).responsePayload(r.getResponsePayload())
                    .errorMessage(r.getErrorMessage()).build();
        }
    }
    @Data
    public static class GenerationRequestInput {
        private Long classId; private Long batchId; private Long generatedByUserId; private String aiModelUsed;
        private String requestPayload;
    }

    // ── SyllabusLog ──
    @Data @Builder @AllArgsConstructor
    public static class SyllabusResponse {
        private Long id; private Long divisionId; private Long subjectId;
        private LocalDate date; private String content; private Long loggedByFacultyId;
        public static SyllabusResponse from(SyllabusLog s) {
            return SyllabusResponse.builder().id(s.getId()).divisionId(s.getDivisionId()).subjectId(s.getSubjectId())
                    .date(s.getDate()).content(s.getContent()).loggedByFacultyId(s.getLoggedByFacultyId()).build();
        }
    }
    @Data
    public static class SyllabusRequest {
        private Long divisionId; private Long subjectId; private LocalDate date;
        private String content; private Long loggedByFacultyId;
    }

    // ── Assignment ──
    @Data @Builder @AllArgsConstructor
    public static class AssignmentResponse {
        private Long id; private Long divisionId; private Long subjectId; private String title;
        private String description; private String attachmentUrl; private LocalDate dueDate; private Long createdByFacultyId;
        public static AssignmentResponse from(Assignment a) {
            return AssignmentResponse.builder().id(a.getId()).divisionId(a.getDivisionId()).subjectId(a.getSubjectId())
                    .title(a.getTitle()).description(a.getDescription()).attachmentUrl(a.getAttachmentUrl())
                    .dueDate(a.getDueDate()).createdByFacultyId(a.getCreatedByFacultyId()).build();
        }
    }
    @Data
    public static class AssignmentRequest {
        private Long divisionId; private Long subjectId; private String title;
        private String description; private String attachmentUrl; private LocalDate dueDate; private Long createdByFacultyId;
    }

    // ── AssignmentSubmission ──
    @Data @Builder @AllArgsConstructor
    public static class SubmissionResponse {
        private Long id; private Long assignmentId; private Long studentId;
        private AssignmentSubmission.SubmissionStatus status; private LocalDateTime submittedAt;
        public static SubmissionResponse from(AssignmentSubmission s) {
            return SubmissionResponse.builder().id(s.getId()).assignmentId(s.getAssignmentId()).studentId(s.getStudentId())
                    .status(s.getStatus()).submittedAt(s.getSubmittedAt()).build();
        }
    }
    @Data
    public static class SubmissionRequest {
        private Long assignmentId; private Long studentId;
    }
}
