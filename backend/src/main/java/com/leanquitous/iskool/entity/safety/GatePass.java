package com.leanquitous.iskool.entity.safety;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "gate_passes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GatePass extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "pass_code", nullable = false, unique = true)
    private String passCode;

    @Column(name = "valid_date", nullable = false)
    private LocalDate validDate;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed;

    @Column(name = "pickup_person_name")
    private String pickupPersonName;

    @Column(name = "pickup_person_phone")
    private String pickupPersonPhone;

    @Column(name = "relationship")
    private String relationship;

    @Column(name = "reason")
    private String reason;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;
}