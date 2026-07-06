package com.leanquitous.iskool.entity.almanac;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "prayers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Prayer extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "language", nullable = false)
    private String language;

    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    @Column(name = "audio_url")
    private String audioUrl;
}
