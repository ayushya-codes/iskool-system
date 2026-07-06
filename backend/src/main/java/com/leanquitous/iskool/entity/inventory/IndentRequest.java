package com.leanquitous.iskool.entity.inventory;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "indent_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class IndentRequest extends BaseEntity {

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private InventoryItem.Category category;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    public enum Priority {
        ROUTINE, URGENT
    }

    public enum Status {
        SUBMITTED, PENDING_APPROVAL, APPROVED, READY_FOR_PICKUP, COLLECTED
    }
}
