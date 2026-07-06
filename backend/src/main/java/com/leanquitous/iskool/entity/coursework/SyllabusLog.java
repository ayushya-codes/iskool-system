package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "syllabus_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SyllabusLog extends BaseEntity {

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "logged_by_faculty_id", nullable = false)
    private Long loggedByFacultyId;
}
