package com.leanquitous.iskool.entity.exam;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "grading_schemes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "grade_label", "min_percentage"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GradingScheme extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "grade_label", nullable = false)
    private String gradeLabel;

    @Column(name = "min_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal minPercentage;

    @Column(name = "max_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxPercentage;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
