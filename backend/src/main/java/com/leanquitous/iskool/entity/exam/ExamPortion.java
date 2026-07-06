package com.leanquitous.iskool.entity.exam;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "exam_portions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "exam_id", "subject_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExamPortion extends BaseEntity {

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "portions", columnDefinition = "TEXT")
    private String portions;
}
