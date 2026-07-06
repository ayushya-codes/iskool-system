package com.leanquitous.iskool.dto.academic;

import com.leanquitous.iskool.entity.academic.AcademicBatch;
import com.leanquitous.iskool.entity.academic.Division;
import com.leanquitous.iskool.entity.academic.SchoolClass;
import com.leanquitous.iskool.entity.academic.Subject;
import com.leanquitous.iskool.entity.academic.Term;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

public class AcademicDtos {

    // ── AcademicBatch ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class BatchResponse {
        private Long id;
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isActive;
        private Long schoolId;

        public static BatchResponse from(AcademicBatch b) {
            return BatchResponse.builder()
                    .id(b.getId()).name(b.getName())
                    .startDate(b.getStartDate()).endDate(b.getEndDate())
                    .isActive(b.getIsActive()).schoolId(b.getSchoolId())
                    .build();
        }
    }

    @Data
    public static class BatchRequest {
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isActive;
    }

    // ── Term ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class TermResponse {
        private Long id;
        private Long batchId;
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
        private Long schoolId;

        public static TermResponse from(Term t) {
            return TermResponse.builder()
                    .id(t.getId()).batchId(t.getBatchId()).name(t.getName())
                    .startDate(t.getStartDate()).endDate(t.getEndDate())
                    .schoolId(t.getSchoolId())
                    .build();
        }
    }

    @Data
    public static class TermRequest {
        private Long batchId;
        private String name;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    // ── SchoolClass ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class ClassResponse {
        private Long id;
        private String name;
        private Integer level;
        private Long schoolId;

        public static ClassResponse from(SchoolClass c) {
            return ClassResponse.builder()
                    .id(c.getId()).name(c.getName()).level(c.getLevel())
                    .schoolId(c.getSchoolId())
                    .build();
        }
    }

    @Data
    public static class ClassRequest {
        private String name;
        private Integer level;
    }

    // ── Division ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class DivisionResponse {
        private Long id;
        private Long classId;
        private String name;
        private Long schoolId;

        public static DivisionResponse from(Division d) {
            return DivisionResponse.builder()
                    .id(d.getId()).classId(d.getClassId()).name(d.getName())
                    .schoolId(d.getSchoolId())
                    .build();
        }
    }

    @Data
    public static class DivisionRequest {
        private Long classId;
        private String name;
    }

    // ── Subject ──

    @Data
    @Builder
    @AllArgsConstructor
    public static class SubjectResponse {
        private Long id;
        private String name;
        private String code;
        private Long schoolId;

        public static SubjectResponse from(Subject s) {
            return SubjectResponse.builder()
                    .id(s.getId()).name(s.getName()).code(s.getCode())
                    .schoolId(s.getSchoolId())
                    .build();
        }
    }

    @Data
    public static class SubjectRequest {
        private String name;
        private String code;
    }
}
