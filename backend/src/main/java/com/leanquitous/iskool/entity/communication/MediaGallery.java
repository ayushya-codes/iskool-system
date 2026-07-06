package com.leanquitous.iskool.entity.communication;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "media_galleries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MediaGallery extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "event_date")
    private java.time.LocalDate eventDate;

    @Column(name = "target_class_level")
    private Integer targetClassLevel;

    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved;

    @Column(name = "approved_by_user_id")
    private Long approvedByUserId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
