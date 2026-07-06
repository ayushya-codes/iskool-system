package com.leanquitous.iskool.entity.finance;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "fee_structures",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "class_id", "fee_type", "batch_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FeeStructure extends BaseEntity {

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Enumerated(EnumType.STRING)
    @Column(name = "fee_type", nullable = false)
    private FeeType feeType;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum FeeType {
        TUITION, BUS, LAB, EXAM, MISC
    }
}
