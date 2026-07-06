package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalTime;

@Entity
@Table(name = "timetable_slots",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "division_id", "day_of_week", "period_number"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TimetableSlot extends BaseEntity {

    @Column(name = "timetable_id")
    private Long timetableId;

    @Column(name = "division_id")
    private Long divisionId;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(name = "period_number", nullable = false)
    private Integer periodNumber;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "faculty_id")
    private Long facultyId;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false)
    private SlotType slotType;

    public enum SlotType {
        LECTURE, LAB, FREE, BREAK, ASSEMBLY
    }
}
