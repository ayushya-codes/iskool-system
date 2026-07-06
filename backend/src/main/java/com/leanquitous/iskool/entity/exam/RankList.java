package com.leanquitous.iskool.entity.exam;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "rank_lists",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "exam_id", "student_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RankList extends BaseEntity {

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "class_rank")
    private Integer classRank;

    @Column(name = "section_rank")
    private Integer sectionRank;

    @Column(name = "school_rank")
    private Integer schoolRank;
}
