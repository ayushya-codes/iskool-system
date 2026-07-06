package com.leanquitous.iskool.entity.holiday;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "holidays")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Holiday extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "holiday_date", nullable = false)
    private LocalDate holidayDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private HolidayType type;

    @Column(name = "description")
    private String description;

    public enum HolidayType {
        PUBLIC, SCHOOL, RELIGIOUS, NATIONAL, BREAK
    }
}
