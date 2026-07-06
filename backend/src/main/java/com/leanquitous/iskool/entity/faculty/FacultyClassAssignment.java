package com.leanquitous.iskool.entity.faculty;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "faculty_class_assignments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "faculty_id", "division_id", "subject_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FacultyClassAssignment extends BaseEntity {

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;
}
