package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "subject_period_requirements",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "division_id", "subject_id", "batch_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SubjectPeriodRequirement extends BaseEntity {

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "periods_per_week", nullable = false)
    private Integer periodsPerWeek;

    @Column(name = "requires_lab")
    private Boolean requiresLab;

    @Column(name = "preferred_day_spread")
    private Integer preferredDaySpread;
}
