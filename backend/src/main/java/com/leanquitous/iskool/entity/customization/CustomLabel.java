package com.leanquitous.iskool.entity.customization;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "custom_labels",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "label_key", "language"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CustomLabel extends BaseEntity {

    @Column(name = "label_key", nullable = false)
    private String labelKey;

    @Column(name = "label_value", nullable = false)
    private String labelValue;

    @Column(name = "language", nullable = false)
    private String language;
}
