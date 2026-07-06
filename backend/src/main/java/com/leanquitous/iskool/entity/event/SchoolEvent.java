package com.leanquitous.iskool.entity.event;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "school_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SchoolEvent extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "venue")
    private String venue;

    @Column(name = "target_class_level")
    private Integer targetClassLevel;

    @Column(name = "target_division_id")
    private Long targetDivisionId;

    @Column(name = "managed_by_user_id")
    private Long managedByUserId;

    public enum EventType {
        SPORTS, CULTURAL, ACADEMIC, ANNUAL_DAY, FIELD_TRIP, COMPETITION, OTHER
    }
}
