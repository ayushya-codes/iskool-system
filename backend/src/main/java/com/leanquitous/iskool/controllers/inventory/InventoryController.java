package com.leanquitous.iskool.controllers.inventory;

import com.leanquitous.iskool.dto.inventory.InventoryDtos.*;
import com.leanquitous.iskool.entity.inventory.IndentRequest;
import com.leanquitous.iskool.entity.inventory.InventoryItem;
import com.leanquitous.iskool.services.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ── Items ──

    @PostMapping("/items")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<InventoryItemResponse> createItem(@RequestBody InventoryItemRequest req) {
        return ResponseEntity.ok(inventoryService.createItem(req));
    }

    @GetMapping("/items")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<InventoryItemResponse>> getAllItems(
            @RequestParam(required = false) InventoryItem.Category category) {
        if (category != null) {
            return ResponseEntity.ok(inventoryService.getItemsByCategory(category));
        }
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/items/my-assigned")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<InventoryItemResponse>> getMyAssignedItems(@RequestParam Long facultyUserId) {
        return ResponseEntity.ok(inventoryService.getItemsByAssignedCategories(facultyUserId));
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<InventoryItemResponse> updateItem(@PathVariable Long id, @RequestBody InventoryItemRequest req) {
        return ResponseEntity.ok(inventoryService.updateItem(id, req));
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    // ── Indents ──

    @PostMapping("/indents")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<IndentResponse> createIndent(@RequestBody IndentRequestInput req) {
        return ResponseEntity.ok(inventoryService.createIndent(req));
    }

    @GetMapping("/indents/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<IndentResponse>> getIndentsByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(inventoryService.getIndentsByFaculty(facultyId));
    }

    @GetMapping("/indents/status/{status}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<IndentResponse>> getIndentsByStatus(@PathVariable IndentRequest.Status status) {
        return ResponseEntity.ok(inventoryService.getIndentsByStatus(status));
    }

    @PutMapping("/indents/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<IndentResponse> updateIndentStatus(@PathVariable Long id, @RequestParam IndentRequest.Status status) {
        return ResponseEntity.ok(inventoryService.updateIndentStatus(id, status));
    }

    // ── Faculty Inventory Assignments ──

    @PostMapping("/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<FacultyInventoryAssignmentResponse> assignFaculty(@RequestBody FacultyInventoryAssignmentRequest req) {
        return ResponseEntity.ok(inventoryService.assignFacultyToCategory(req));
    }

    @GetMapping("/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<FacultyInventoryAssignmentResponse>> getAllAssignments() {
        return ResponseEntity.ok(inventoryService.getAllAssignments());
    }

    @DeleteMapping("/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> removeAssignment(@RequestParam Long facultyUserId, @RequestParam InventoryItem.Category category) {
        inventoryService.removeAssignment(facultyUserId, category);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignments/my-categories")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<InventoryItem.Category>> getMyCategories(@RequestParam Long facultyUserId) {
        return ResponseEntity.ok(inventoryService.getAssignedCategories(facultyUserId));
    }
}
