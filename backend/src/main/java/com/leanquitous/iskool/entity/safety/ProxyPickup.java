package com.leanquitous.iskool.entity.safety;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "proxy_pickups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProxyPickup extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "pickup_person_name", nullable = false)
    private String pickupPersonName;

    @Column(name = "pickup_person_photo_url")
    private String pickupPersonPhotoUrl;

    @Column(name = "valid_date", nullable = false)
    private LocalDate validDate;
}
