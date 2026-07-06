package com.leanquitous.iskool.entity.exam;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Exam extends BaseEntity {

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false)
    private ExamType examType;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum ExamType {
        UNIT, TERMINAL
    }
}
