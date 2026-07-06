package com.leanquitous.iskool.entity.communication;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "circulars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Circular extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @Column(name = "published_date", nullable = false)
    private LocalDate publishedDate;

    @Column(name = "target_class_level")
    private Integer targetClassLevel;

    @Column(name = "published_by_user_id", nullable = false)
    private Long publishedByUserId;
}
