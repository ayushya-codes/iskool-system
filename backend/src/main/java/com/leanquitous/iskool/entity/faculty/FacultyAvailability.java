package com.leanquitous.iskool.entity.faculty;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalTime;

@Entity
@Table(name = "faculty_availability",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "faculty_id", "day_of_week"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FacultyAvailability extends BaseEntity {

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(name = "available_from", nullable = false)
    private LocalTime availableFrom;

    @Column(name = "available_to", nullable = false)
    private LocalTime availableTo;

    @Column(name = "is_preferred_slot")
    private Boolean isPreferredSlot;

    @Column(name = "notes")
    private String notes;
}
