package com.leanquitous.iskool.entity.student;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "student_enrollments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "student_id", "batch_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudentEnrollment extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "roll_number", nullable = false)
    private String rollNumber;
}
