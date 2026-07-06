package com.leanquitous.iskool.entity.exam;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "report_cards",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "student_id", "batch_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ReportCard extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved;

    @Column(name = "approved_by_user_id")
    private Long approvedByUserId;
}
