package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Assignment extends BaseEntity {

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "created_by_faculty_id", nullable = false)
    private Long createdByFacultyId;
}
