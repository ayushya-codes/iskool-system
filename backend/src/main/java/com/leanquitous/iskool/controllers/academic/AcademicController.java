package com.leanquitous.iskool.controllers.academic;

import com.leanquitous.iskool.dto.academic.AcademicDtos.*;
import com.leanquitous.iskool.services.academic.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    // ── Batch ──

    @PostMapping("/batches")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<BatchResponse> createBatch(@RequestBody BatchRequest req) {
        return ResponseEntity.ok(academicService.createBatch(req));
    }

    @GetMapping("/batches")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<BatchResponse>> getAllBatches() {
        return ResponseEntity.ok(academicService.getAllBatches());
    }

    @GetMapping("/batches/active")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<BatchResponse> getActiveBatch() {
        return ResponseEntity.ok(academicService.getActiveBatch());
    }

    @PutMapping("/batches/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<BatchResponse> updateBatch(@PathVariable Long id, @RequestBody BatchRequest req) {
        return ResponseEntity.ok(academicService.updateBatch(id, req));
    }

    @DeleteMapping("/batches/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        academicService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    // ── Term ──

    @PostMapping("/terms")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<TermResponse> createTerm(@RequestBody TermRequest req) {
        return ResponseEntity.ok(academicService.createTerm(req));
    }

    @GetMapping("/terms/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<TermResponse>> getTermsByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(academicService.getTermsByBatch(batchId));
    }

    @DeleteMapping("/terms/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteTerm(@PathVariable Long id) {
        academicService.deleteTerm(id);
        return ResponseEntity.noContent().build();
    }

    // ── Class ──

    @PostMapping("/classes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ClassResponse> createClass(@RequestBody ClassRequest req) {
        return ResponseEntity.ok(academicService.createClass(req));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        return ResponseEntity.ok(academicService.getAllClasses());
    }

    @PutMapping("/classes/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ClassResponse> updateClass(@PathVariable Long id, @RequestBody ClassRequest req) {
        return ResponseEntity.ok(academicService.updateClass(id, req));
    }

    @DeleteMapping("/classes/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        academicService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // ── Division ──

    @PostMapping("/divisions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<DivisionResponse> createDivision(@RequestBody DivisionRequest req) {
        return ResponseEntity.ok(academicService.createDivision(req));
    }

    @GetMapping("/divisions/class/{classId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<DivisionResponse>> getDivisionsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(academicService.getDivisionsByClass(classId));
    }

    @DeleteMapping("/divisions/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteDivision(@PathVariable Long id) {
        academicService.deleteDivision(id);
        return ResponseEntity.noContent().build();
    }

    // ── Subject ──

    @PostMapping("/subjects")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<SubjectResponse> createSubject(@RequestBody SubjectRequest req) {
        return ResponseEntity.ok(academicService.createSubject(req));
    }

    @GetMapping("/subjects")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        return ResponseEntity.ok(academicService.getAllSubjects());
    }

    @PutMapping("/subjects/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<SubjectResponse> updateSubject(@PathVariable Long id, @RequestBody SubjectRequest req) {
        return ResponseEntity.ok(academicService.updateSubject(id, req));
    }

    @DeleteMapping("/subjects/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        academicService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
