package com.leanquitous.iskool.entity.communication;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "class_announcements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ClassAnnouncement extends BaseEntity {

    @Column(name = "division_id", nullable = false)
    private Long divisionId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "published_by_faculty_id", nullable = false)
    private Long publishedByFacultyId;
}
