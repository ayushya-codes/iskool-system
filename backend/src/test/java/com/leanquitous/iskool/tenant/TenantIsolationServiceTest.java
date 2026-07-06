package com.leanquitous.iskool.tenant;

import com.leanquitous.iskool.dto.academic.AcademicDtos.*;
import com.leanquitous.iskool.dto.inventory.InventoryDtos.*;
import com.leanquitous.iskool.dto.student.StudentDtos.*;
import com.leanquitous.iskool.entity.academic.AcademicBatch;
import com.leanquitous.iskool.entity.inventory.InventoryItem;
import com.leanquitous.iskool.entity.student.Student;
import com.leanquitous.iskool.repositories.academic.AcademicBatchRepository;
import com.leanquitous.iskool.repositories.inventory.InventoryItemRepository;
import com.leanquitous.iskool.repositories.student.StudentRepository;
import com.leanquitous.iskool.services.academic.AcademicService;
import com.leanquitous.iskool.services.inventory.InventoryService;
import com.leanquitous.iskool.services.student.StudentService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Service-level tenant isolation tests")
class TenantIsolationServiceTest {

    @Autowired private StudentService studentService;
    @Autowired private StudentRepository studentRepo;
    @Autowired private InventoryService inventoryService;
    @Autowired private InventoryItemRepository itemRepo;
    @Autowired private AcademicService academicService;
    @Autowired private AcademicBatchRepository batchRepo;

    private static final Long SCHOOL_A = 1L;
    private static final Long SCHOOL_B = 2L;

    @AfterEach
    void cleanup() {
        TenantContext.clear();
        studentRepo.deleteAll();
        itemRepo.deleteAll();
        batchRepo.deleteAll();
    }

    // ── Student Service ──

    @Nested
    @DisplayName("StudentService tenant isolation")
    class StudentServiceIsolation {

        @Test
        @DisplayName("getAll returns only students for current tenant")
        void getAllReturnsOnlyCurrentTenantStudents() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            studentRepo.save(Student.builder()
                    .firstName("Alice").lastName("Smith")
                    .admissionDate(LocalDate.now()).isActive(true)
                    .schoolId(SCHOOL_A).build());
            studentRepo.save(Student.builder()
                    .firstName("Bob").lastName("Jones")
                    .admissionDate(LocalDate.now()).isActive(true)
                    .schoolId(SCHOOL_B).build());

            List<StudentResponse> students = studentService.getAll();
            assertEquals(1, students.size());
            assertEquals("Alice", students.get(0).getFirstName());
        }

        @Test
        @DisplayName("getById throws when student belongs to different tenant")
        void getByIdThrowsForDifferentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            Student student = studentRepo.save(Student.builder()
                    .firstName("Charlie").lastName("Brown")
                    .admissionDate(LocalDate.now()).isActive(true)
                    .schoolId(SCHOOL_B).build());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> studentService.getById(student.getId()));
            assertTrue(ex.getMessage().contains("Access denied"));
        }

        @Test
        @DisplayName("getById succeeds when student belongs to current tenant")
        void getByIdSucceedsForSameTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            Student student = studentRepo.save(Student.builder()
                    .firstName("Daisy").lastName("Miller")
                    .admissionDate(LocalDate.now()).isActive(true)
                    .schoolId(SCHOOL_A).build());

            StudentResponse response = studentService.getById(student.getId());
            assertEquals("Daisy", response.getFirstName());
        }
    }

    // ── Inventory Service ──

    @Nested
    @DisplayName("InventoryService tenant isolation")
    class InventoryServiceIsolation {

        @Test
        @DisplayName("getAllItems returns only items for current tenant")
        void getAllItemsReturnsOnlyCurrentTenantItems() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            itemRepo.save(InventoryItem.builder()
                    .name("Pencils").category(InventoryItem.Category.STATIONERY)
                    .quantity(100).schoolId(SCHOOL_A).build());
            itemRepo.save(InventoryItem.builder()
                    .name("Basketballs").category(InventoryItem.Category.SPORTS)
                    .quantity(20).schoolId(SCHOOL_B).build());

            List<InventoryItemResponse> items = inventoryService.getAllItems();
            assertEquals(1, items.size());
            assertEquals("Pencils", items.get(0).getName());
        }

        @Test
        @DisplayName("updateItem throws when item belongs to different tenant")
        void updateItemThrowsForDifferentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            InventoryItem item = itemRepo.save(InventoryItem.builder()
                    .name("Markers").category(InventoryItem.Category.STATIONERY)
                    .quantity(50).schoolId(SCHOOL_B).build());

            InventoryItemRequest req = new InventoryItemRequest();
            req.setName("Updated Markers");

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> inventoryService.updateItem(item.getId(), req));
            assertTrue(ex.getMessage().contains("Access denied"));
        }

        @Test
        @DisplayName("deleteItem throws when item belongs to different tenant")
        void deleteItemThrowsForDifferentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            InventoryItem item = itemRepo.save(InventoryItem.builder()
                    .name("Chairs").category(InventoryItem.Category.FURNITURE)
                    .quantity(30).schoolId(SCHOOL_B).build());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> inventoryService.deleteItem(item.getId()));
            assertTrue(ex.getMessage().contains("Access denied"));
        }
    }

    // ── Academic Service ──

    @Nested
    @DisplayName("AcademicService tenant isolation")
    class AcademicServiceIsolation {

        @Test
        @DisplayName("getAllBatches returns only batches for current tenant")
        void getAllBatchesReturnsOnlyCurrentTenantBatches() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            batchRepo.save(AcademicBatch.builder()
                    .name("2026-2027").startDate(LocalDate.of(2026, 4, 1))
                    .endDate(LocalDate.of(2027, 3, 31)).isActive(true)
                    .schoolId(SCHOOL_A).build());
            batchRepo.save(AcademicBatch.builder()
                    .name("2025-2026").startDate(LocalDate.of(2025, 4, 1))
                    .endDate(LocalDate.of(2026, 3, 31)).isActive(true)
                    .schoolId(SCHOOL_B).build());

            List<BatchResponse> batches = academicService.getAllBatches();
            assertEquals(1, batches.size());
            assertEquals("2026-2027", batches.get(0).getName());
        }

        @Test
        @DisplayName("updateBatch throws when batch belongs to different tenant")
        void updateBatchThrowsForDifferentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            AcademicBatch batch = batchRepo.save(AcademicBatch.builder()
                    .name("Old Batch").startDate(LocalDate.of(2024, 4, 1))
                    .endDate(LocalDate.of(2025, 3, 31)).isActive(false)
                    .schoolId(SCHOOL_B).build());

            BatchRequest req = new BatchRequest();
            req.setName("Updated Batch");

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> academicService.updateBatch(batch.getId(), req));
            assertTrue(ex.getMessage().contains("Access denied"));
        }

        @Test
        @DisplayName("deleteBatch throws when batch belongs to different tenant")
        void deleteBatchThrowsForDifferentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_A);
            AcademicBatch batch = batchRepo.save(AcademicBatch.builder()
                    .name("Delete Me").startDate(LocalDate.of(2024, 4, 1))
                    .endDate(LocalDate.of(2025, 3, 31)).isActive(false)
                    .schoolId(SCHOOL_B).build());

            RuntimeException ex = assertThrows(RuntimeException.class,
                    () -> academicService.deleteBatch(batch.getId()));
            assertTrue(ex.getMessage().contains("Access denied"));
        }

        @Test
        @DisplayName("createBatch stamps current tenant schoolId on new batch")
        void createBatchStampsCurrentTenant() {
            TenantContext.setCurrentTenant(SCHOOL_B);
            BatchRequest req = new BatchRequest();
            req.setName("New Batch 2027");
            req.setStartDate(LocalDate.of(2027, 4, 1));
            req.setEndDate(LocalDate.of(2028, 3, 31));
            req.setIsActive(true);

            BatchResponse response = academicService.createBatch(req);
            assertEquals(SCHOOL_B, response.getSchoolId());
        }
    }
}
