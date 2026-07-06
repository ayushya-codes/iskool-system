package com.leanquitous.iskool.services.inventory;

import com.leanquitous.iskool.dto.inventory.InventoryDtos.*;
import com.leanquitous.iskool.entity.inventory.*;
import com.leanquitous.iskool.repositories.inventory.*;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository itemRepo;
    private final IndentRequestRepository indentRepo;
    private final FacultyInventoryAssignmentRepository assignmentRepo;
    private final UserRepository userRepository;

    public InventoryItemResponse createItem(InventoryItemRequest req) {
        InventoryItem item = InventoryItem.builder().name(req.getName()).category(req.getCategory())
                .quantity(req.getQuantity()).lowStockThreshold(req.getLowStockThreshold())
                .isActive(true).schoolId(TenantContext.getCurrentTenant()).build();
        return InventoryItemResponse.from(itemRepo.save(item));
    }

    public List<InventoryItemResponse> getAllItems() {
        return itemRepo.findBySchoolIdAndIsActiveTrue(TenantContext.getCurrentTenant()).stream().map(InventoryItemResponse::from).toList();
    }

    public List<InventoryItemResponse> getItemsByCategory(InventoryItem.Category category) {
        return itemRepo.findBySchoolIdAndCategoryAndIsActiveTrue(TenantContext.getCurrentTenant(), category)
                .stream().map(InventoryItemResponse::from).toList();
    }

    public List<InventoryItemResponse> getItemsByAssignedCategories(Long facultyUserId) {
        Long schoolId = TenantContext.getCurrentTenant();
        List<FacultyInventoryAssignment> assignments = assignmentRepo.findBySchoolIdAndFacultyUserId(schoolId, facultyUserId);
        if (assignments.isEmpty()) {
            return List.of();
        }
        Set<InventoryItem.Category> categories = assignments.stream().map(FacultyInventoryAssignment::getCategory).collect(Collectors.toSet());
        return itemRepo.findBySchoolIdAndCategoryInAndIsActiveTrue(schoolId, categories).stream().map(InventoryItemResponse::from).toList();
    }

    public List<InventoryItem.Category> getAssignedCategories(Long facultyUserId) {
        return assignmentRepo.findBySchoolIdAndFacultyUserId(TenantContext.getCurrentTenant(), facultyUserId)
                .stream().map(FacultyInventoryAssignment::getCategory).distinct().toList();
    }

    public InventoryItemResponse updateItem(Long id, InventoryItemRequest req) {
        InventoryItem item = itemRepo.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        TenantValidator.validateOwnership(item.getSchoolId());
        if (req.getName() != null) item.setName(req.getName());
        if (req.getCategory() != null) item.setCategory(req.getCategory());
        if (req.getQuantity() != null) item.setQuantity(req.getQuantity());
        if (req.getLowStockThreshold() != null) item.setLowStockThreshold(req.getLowStockThreshold());
        return InventoryItemResponse.from(itemRepo.save(item));
    }

    public void deleteItem(Long id) {
        InventoryItem item = itemRepo.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        TenantValidator.validateOwnership(item.getSchoolId());
        item.setIsActive(false);
        itemRepo.save(item);
    }

    public IndentResponse createIndent(IndentRequestInput req) {
        IndentRequest indent = IndentRequest.builder().facultyId(req.getFacultyId()).itemName(req.getItemName())
                .category(req.getCategory()).quantity(req.getQuantity()).priority(req.getPriority())
                .status(IndentRequest.Status.SUBMITTED).schoolId(TenantContext.getCurrentTenant()).build();
        return IndentResponse.from(indentRepo.save(indent));
    }

    public List<IndentResponse> getIndentsByFaculty(Long facultyId) {
        return indentRepo.findBySchoolIdAndFacultyId(TenantContext.getCurrentTenant(), facultyId)
                .stream().map(IndentResponse::from).toList();
    }

    public List<IndentResponse> getIndentsByStatus(IndentRequest.Status status) {
        return indentRepo.findBySchoolIdAndStatus(TenantContext.getCurrentTenant(), status)
                .stream().map(IndentResponse::from).toList();
    }

    public IndentResponse updateIndentStatus(Long id, IndentRequest.Status status) {
        IndentRequest indent = indentRepo.findById(id).orElseThrow(() -> new RuntimeException("Indent not found"));
        TenantValidator.validateOwnership(indent.getSchoolId());
        indent.setStatus(status);
        return IndentResponse.from(indentRepo.save(indent));
    }

    // ── Faculty Inventory Assignment ──

    public FacultyInventoryAssignmentResponse assignFacultyToCategory(FacultyInventoryAssignmentRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        if (assignmentRepo.existsBySchoolIdAndFacultyUserIdAndCategory(schoolId, req.getFacultyUserId(), req.getCategory())) {
            throw new RuntimeException("Faculty already assigned to this category");
        }
        FacultyInventoryAssignment assignment = FacultyInventoryAssignment.builder()
                .facultyUserId(req.getFacultyUserId())
                .category(req.getCategory())
                .schoolId(schoolId)
                .build();
        FacultyInventoryAssignment saved = assignmentRepo.save(assignment);
        String facultyName = userRepository.findById(req.getFacultyUserId()).map(u -> u.getFullName()).orElse(null);
        return FacultyInventoryAssignmentResponse.from(saved, facultyName);
    }

    public List<FacultyInventoryAssignmentResponse> getAllAssignments() {
        Long schoolId = TenantContext.getCurrentTenant();
        return assignmentRepo.findAll().stream()
                .filter(a -> schoolId != null && schoolId.equals(a.getSchoolId()))
                .map(a -> {
                    String facultyName = userRepository.findById(a.getFacultyUserId()).map(u -> u.getFullName()).orElse(null);
                    return FacultyInventoryAssignmentResponse.from(a, facultyName);
                })
                .toList();
    }

    public void removeAssignment(Long facultyUserId, InventoryItem.Category category) {
        assignmentRepo.deleteBySchoolIdAndFacultyUserIdAndCategory(TenantContext.getCurrentTenant(), facultyUserId, category);
    }
}
