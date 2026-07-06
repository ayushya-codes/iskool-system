package com.leanquitous.iskool.dto.inventory;

import com.leanquitous.iskool.entity.inventory.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

public class InventoryDtos {

    // ── InventoryItem ──
    @Data @Builder @AllArgsConstructor
    public static class InventoryItemResponse {
        private Long id; private String name; private InventoryItem.Category category;
        private Integer quantity; private Integer lowStockThreshold; private Boolean isActive;
        public static InventoryItemResponse from(InventoryItem i) {
            return InventoryItemResponse.builder().id(i.getId()).name(i.getName()).category(i.getCategory())
                    .quantity(i.getQuantity()).lowStockThreshold(i.getLowStockThreshold()).isActive(i.getIsActive()).build();
        }
    }
    @Data
    public static class InventoryItemRequest {
        private String name; private InventoryItem.Category category;
        private Integer quantity; private Integer lowStockThreshold;
    }

    // ── IndentRequest ──
    @Data @Builder @AllArgsConstructor
    public static class IndentResponse {
        private Long id; private Long facultyId; private String itemName;
        private InventoryItem.Category category; private Integer quantity;
        private IndentRequest.Priority priority; private IndentRequest.Status status;
        public static IndentResponse from(IndentRequest r) {
            return IndentResponse.builder().id(r.getId()).facultyId(r.getFacultyId()).itemName(r.getItemName())
                    .category(r.getCategory()).quantity(r.getQuantity()).priority(r.getPriority()).status(r.getStatus()).build();
        }
    }
    @Data
    public static class IndentRequestInput {
        private Long facultyId; private String itemName; private InventoryItem.Category category;
        private Integer quantity; private IndentRequest.Priority priority;
    }

    // ── Faculty Inventory Assignment ──

    @Data @Builder @AllArgsConstructor
    public static class FacultyInventoryAssignmentResponse {
        private Long id;
        private Long facultyUserId;
        private String facultyName;
        private InventoryItem.Category category;

        public static FacultyInventoryAssignmentResponse from(com.leanquitous.iskool.entity.inventory.FacultyInventoryAssignment a, String facultyName) {
            return FacultyInventoryAssignmentResponse.builder()
                    .id(a.getId()).facultyUserId(a.getFacultyUserId())
                    .facultyName(facultyName).category(a.getCategory())
                    .build();
        }
    }

    @Data
    public static class FacultyInventoryAssignmentRequest {
        private Long facultyUserId;
        private InventoryItem.Category category;
    }
}
