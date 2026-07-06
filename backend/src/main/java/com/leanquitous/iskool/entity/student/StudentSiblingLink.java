package com.leanquitous.iskool.entity.student;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "student_sibling_links",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "student_id", "sibling_student_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudentSiblingLink extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "sibling_student_id", nullable = false)
    private Long siblingStudentId;
}
