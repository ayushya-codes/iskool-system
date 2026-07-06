package com.leanquitous.iskool.entity.faculty;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "faculty_attendance",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "faculty_id", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FacultyAttendance extends BaseEntity {

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "clock_in")
    private LocalTime clockIn;

    @Column(name = "clock_out")
    private LocalTime clockOut;
}
