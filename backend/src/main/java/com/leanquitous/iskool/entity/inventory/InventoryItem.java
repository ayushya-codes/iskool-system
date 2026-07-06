package com.leanquitous.iskool.entity.inventory;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class InventoryItem extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Category category;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public enum Category {
        STATIONERY, LAB_EQUIPMENT, ACADEMICS, SPORTS, IT_EQUIPMENT, FURNITURE, LIBRARY, GENERAL
    }
}
