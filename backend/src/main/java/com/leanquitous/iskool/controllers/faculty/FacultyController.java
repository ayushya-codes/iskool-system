package com.leanquitous.iskool.controllers.faculty;

import com.leanquitous.iskool.dto.faculty.FacultyDtos.*;
import com.leanquitous.iskool.services.faculty.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    // ── Faculty CRUD ──

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<FacultyResponse> create(@RequestBody FacultyRequest req) {
        return ResponseEntity.ok(facultyService.create(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<FacultyResponse>> getAll() {
        return ResponseEntity.ok(facultyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<FacultyResponse> update(@PathVariable Long id, @RequestBody FacultyRequest req) {
        return ResponseEntity.ok(facultyService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facultyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Class Assignments ──

    @PostMapping("/{id}/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<ClassAssignmentResponse> assignClass(@PathVariable Long id,
                                                               @RequestBody ClassAssignmentRequest req) {
        return ResponseEntity.ok(facultyService.assignClass(id, req));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<List<ClassAssignmentResponse>> getAssignments(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getAssignments(id));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long assignmentId) {
        facultyService.removeAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }

    // ── Attendance ──

    @PostMapping("/{id}/clock-in")
    public ResponseEntity<FacultyAttendanceResponse> clockIn(@PathVariable Long id,
                                                              @RequestBody ClockInRequest req) {
        return ResponseEntity.ok(facultyService.clockIn(id, req));
    }

    @PostMapping("/{id}/clock-out")
    public ResponseEntity<FacultyAttendanceResponse> clockOut(@PathVariable Long id,
                                                               @RequestBody ClockOutRequest req) {
        return ResponseEntity.ok(facultyService.clockOut(id, req));
    }

    @GetMapping("/{id}/attendance")
    public ResponseEntity<List<FacultyAttendanceResponse>> getAttendance(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(facultyService.getAttendanceRange(id, from, to));
    }

    // ── Availability ──

    @PostMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<AvailabilityResponse> setAvailability(@PathVariable Long id,
                                                                @RequestBody AvailabilityRequest req) {
        return ResponseEntity.ok(facultyService.setAvailability(id, req));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getAvailability(id));
    }

    @DeleteMapping("/availability/{availabilityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<Void> removeAvailability(@PathVariable Long availabilityId) {
        facultyService.removeAvailability(availabilityId);
        return ResponseEntity.noContent().build();
    }
}
