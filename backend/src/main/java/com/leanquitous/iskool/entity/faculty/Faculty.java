package com.leanquitous.iskool.entity.faculty;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "faculty")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Faculty extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "certifications", columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "max_weekly_lectures")
    private Integer maxWeeklyLectures;
}
