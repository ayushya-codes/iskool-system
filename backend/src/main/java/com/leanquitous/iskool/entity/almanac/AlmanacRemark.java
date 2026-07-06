package com.leanquitous.iskool.entity.almanac;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "almanac_remarks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AlmanacRemark extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "remark", nullable = false, columnDefinition = "TEXT")
    private String remark;

    @Column(name = "remark_date", nullable = false)
    private LocalDate remarkDate;

    @Column(name = "remarked_by_user_id", nullable = false)
    private Long remarkedByUserId;
}
