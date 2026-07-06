package com.leanquitous.iskool.entity.coursework;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "class_timetables",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "class_id", "batch_id", "name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ClassTimetable extends BaseEntity {

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "batch_id", nullable = false)
    private Long batchId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "is_shared", nullable = false)
    private Boolean isShared;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished;
}
