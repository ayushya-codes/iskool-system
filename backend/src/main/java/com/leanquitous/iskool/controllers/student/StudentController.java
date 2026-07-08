package com.leanquitous.iskool.controllers.student;

import com.leanquitous.iskool.dto.student.StudentDtos.*;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.services.student.StudentService;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'CLERK')")
public class StudentController {

    private final StudentService studentService;
    private final UserRepository userRepository;

    // ── Parent-scoped ──

    @GetMapping("/my-child")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<StudentResponse> getMyChild(Authentication authentication) {
        String email = authentication.getName();
        Long schoolId = TenantContext.getCurrentTenant();
        var user = userRepository.findByEmailAndSchoolId(email, schoolId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var student = studentService.findByParentUserId(user.getId(), schoolId);
        return ResponseEntity.ok(StudentResponse.from(student));
    }

    @GetMapping("/my-children")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<StudentResponse>> getMyChildren(Authentication authentication) {
        String email = authentication.getName();
        Long schoolId = TenantContext.getCurrentTenant();
        var user = userRepository.findByEmailAndSchoolId(email, schoolId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(studentService.findAllByParentUserId(user.getId(), schoolId));
    }

    // ── Student CRUD ──

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK')")
    public ResponseEntity<StudentResponse> create(@RequestBody StudentRequest req) {
        return ResponseEntity.ok(studentService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAll(
            @RequestParam(required = false) Long batchId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long divisionId) {
        if (batchId != null || classId != null || divisionId != null) {
            return ResponseEntity.ok(studentService.getFiltered(batchId, classId, divisionId));
        }
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<StudentDetailResponse> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getDetail(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK')")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id, @RequestBody StudentRequest req) {
        return ResponseEntity.ok(studentService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Medical ──

    @PutMapping("/{id}/medical")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<MedicalResponse> upsertMedical(@PathVariable Long id, @RequestBody MedicalRequest req) {
        return ResponseEntity.ok(studentService.upsertMedical(id, req));
    }

    // ── Enrollment ──

    @PostMapping("/{id}/enrollments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'CLERK')")
    public ResponseEntity<EnrollmentResponse> enroll(@PathVariable Long id, @RequestBody EnrollmentRequest req) {
        return ResponseEntity.ok(studentService.enroll(id, req));
    }

    @GetMapping("/{id}/enrollments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollments(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getEnrollments(id));
    }

    // ── Emergency Contacts ──

    @PostMapping("/{id}/emergency-contacts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<EmergencyContactResponse> addEmergencyContact(@PathVariable Long id,
                                                                        @RequestBody EmergencyContactRequest req) {
        return ResponseEntity.ok(studentService.addEmergencyContact(id, req));
    }

    @GetMapping("/{id}/emergency-contacts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<EmergencyContactResponse>> getEmergencyContacts(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getEmergencyContacts(id));
    }

    @DeleteMapping("/emergency-contacts/{contactId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> deleteEmergencyContact(@PathVariable Long contactId) {
        studentService.deleteEmergencyContact(contactId);
        return ResponseEntity.noContent().build();
    }

    // ── Siblings ──

    @PostMapping("/{id}/siblings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> addSibling(@PathVariable Long id, @RequestBody SiblingLinkRequest req) {
        studentService.addSibling(id, req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/siblings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<com.leanquitous.iskool.entity.student.StudentSiblingLink>> getSiblings(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getSiblings(id));
    }

    @DeleteMapping("/siblings/{linkId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> removeSibling(@PathVariable Long linkId) {
        studentService.removeSibling(linkId);
        return ResponseEntity.noContent().build();
    }

    // ── Timeline ──

    @PostMapping("/{id}/timeline")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<TimelineResponse> addTimelineEvent(@PathVariable Long id, @RequestBody TimelineRequest req) {
        return ResponseEntity.ok(studentService.addTimelineEvent(id, req));
    }

    @GetMapping("/{id}/timeline")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'SUPERVISOR', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<TimelineResponse>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getTimeline(id));
    }
}
