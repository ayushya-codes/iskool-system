package com.leanquitous.iskool.entity.inventory;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "faculty_inventory_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FacultyInventoryAssignment extends BaseEntity {

    @Column(name = "faculty_user_id", nullable = false)
    private Long facultyUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private InventoryItem.Category category;
}
