package com.leanquitous.iskool.dto.exam;

import com.leanquitous.iskool.entity.exam.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ExamDtos {

    // ── Exam ──
    @Data @Builder @AllArgsConstructor
    public static class ExamResponse {
        private Long id; private Long divisionId; private Long batchId; private String name;
        private Exam.ExamType examType; private LocalDate examDate;
        public static ExamResponse from(Exam e) {
            return ExamResponse.builder().id(e.getId()).divisionId(e.getDivisionId()).batchId(e.getBatchId())
                    .name(e.getName()).examType(e.getExamType()).examDate(e.getExamDate()).build();
        }
    }
    @Data
    public static class ExamRequest {
        private Long divisionId; private Long batchId; private String name;
        private Exam.ExamType examType; private LocalDate examDate;
    }

    // ── ExamPortion ──
    @Data @Builder @AllArgsConstructor
    public static class ExamPortionResponse {
        private Long id; private Long examId; private Long subjectId; private String portions;
        public static ExamPortionResponse from(ExamPortion p) {
            return ExamPortionResponse.builder().id(p.getId()).examId(p.getExamId()).subjectId(p.getSubjectId()).portions(p.getPortions()).build();
        }
    }
    @Data
    public static class ExamPortionRequest {
        private Long examId; private Long subjectId; private String portions;
    }

    // ── ExamResult ──
    @Data @Builder @AllArgsConstructor
    public static class ExamResultResponse {
        private Long id; private Long examId; private Long studentId; private Long subjectId;
        private BigDecimal marksObtained; private BigDecimal maxMarks; private String grade;
        private Long uploadedByUserId;
        public static ExamResultResponse from(ExamResult r) {
            return ExamResultResponse.builder().id(r.getId()).examId(r.getExamId()).studentId(r.getStudentId())
                    .subjectId(r.getSubjectId()).marksObtained(r.getMarksObtained()).maxMarks(r.getMaxMarks()).grade(r.getGrade())
                    .uploadedByUserId(r.getUploadedByUserId()).build();
        }
    }
    @Data
    public static class ExamResultRequest {
        private Long examId; private Long studentId; private Long subjectId;
        private BigDecimal marksObtained; private BigDecimal maxMarks; private String grade;
        private Long uploadedByUserId;
    }

    // ── GradingScheme ──
    @Data @Builder @AllArgsConstructor
    public static class GradingSchemeResponse {
        private Long id; private String name; private String gradeLabel;
        private BigDecimal minPercentage; private BigDecimal maxPercentage;
        public static GradingSchemeResponse from(GradingScheme g) {
            return GradingSchemeResponse.builder().id(g.getId()).name(g.getName()).gradeLabel(g.getGradeLabel())
                    .minPercentage(g.getMinPercentage()).maxPercentage(g.getMaxPercentage()).build();
        }
    }
    @Data
    public static class GradingSchemeRequest {
        private String name; private String gradeLabel;
        private BigDecimal minPercentage; private BigDecimal maxPercentage;
    }

    // ── RankList ──
    @Data @Builder @AllArgsConstructor
    public static class RankListResponse {
        private Long id; private Long examId; private Long studentId;
        private Integer classRank; private Integer sectionRank; private Integer schoolRank;
        public static RankListResponse from(RankList r) {
            return RankListResponse.builder().id(r.getId()).examId(r.getExamId()).studentId(r.getStudentId())
                    .classRank(r.getClassRank()).sectionRank(r.getSectionRank()).schoolRank(r.getSchoolRank()).build();
        }
    }
    @Data
    public static class RankListRequest {
        private Long examId; private Long studentId;
        private Integer classRank; private Integer sectionRank; private Integer schoolRank;
    }

    // ── ReportCard ──
    @Data @Builder @AllArgsConstructor
    public static class ReportCardResponse {
        private Long id; private Long studentId; private Long batchId;
        private String fileUrl; private Boolean isApproved; private Long approvedByUserId;
        public static ReportCardResponse from(ReportCard r) {
            return ReportCardResponse.builder().id(r.getId()).studentId(r.getStudentId()).batchId(r.getBatchId())
                    .fileUrl(r.getFileUrl()).isApproved(r.getIsApproved()).approvedByUserId(r.getApprovedByUserId()).build();
        }
    }
    @Data
    public static class ReportCardRequest {
        private Long studentId; private Long batchId; private String fileUrl;
    }
}
