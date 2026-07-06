package com.leanquitous.iskool.controllers.coursework;

import com.leanquitous.iskool.dto.coursework.CourseworkDtos.*;
import com.leanquitous.iskool.entity.coursework.TimetableGenerationRequest;
import com.leanquitous.iskool.entity.student.Student;
import com.leanquitous.iskool.entity.student.StudentEnrollment;
import com.leanquitous.iskool.repositories.student.StudentEnrollmentRepository;
import com.leanquitous.iskool.repositories.student.StudentRepository;
import com.leanquitous.iskool.services.coursework.CourseworkService;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coursework")
@RequiredArgsConstructor
public class CourseworkController {

    private final CourseworkService courseworkService;
    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;

    // ── Timetable ──
    @PostMapping("/timetables")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<TimetableResponse> createTimetable(@RequestBody TimetableRequest req) {
        return ResponseEntity.ok(courseworkService.createTimetable(req));
    }

    @GetMapping("/timetables/batch/{batchId}")
    public ResponseEntity<List<TimetableResponse>> getTimetablesByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(courseworkService.getTimetablesByBatch(batchId));
    }

    @PutMapping("/timetables/{id}/publish")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<TimetableResponse> publishTimetable(@PathVariable Long id) {
        return ResponseEntity.ok(courseworkService.publishTimetable(id));
    }

    // ── Slots ──
    @PostMapping("/slots")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<SlotResponse> createSlot(@RequestBody SlotRequest req) {
        return ResponseEntity.ok(courseworkService.createSlot(req));
    }

    @GetMapping("/slots/division/{divisionId}")
    public ResponseEntity<List<SlotResponse>> getSlotsByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(courseworkService.getSlotsByDivision(divisionId));
    }

    @GetMapping("/slots/timetable/{timetableId}")
    public ResponseEntity<List<SlotResponse>> getSlotsByTimetable(@PathVariable Long timetableId) {
        return ResponseEntity.ok(courseworkService.getSlotsByTimetable(timetableId));
    }

    @GetMapping("/slots/faculty/{facultyId}/day/{dayOfWeek}")
    public ResponseEntity<List<SlotResponse>> getFacultySlotsByDay(@PathVariable Long facultyId, @PathVariable Integer dayOfWeek) {
        return ResponseEntity.ok(courseworkService.getFacultySlotsByDay(facultyId, dayOfWeek));
    }

    @DeleteMapping("/slots/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        courseworkService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }

    // ── Room ──
    @PostMapping("/rooms")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest req) {
        return ResponseEntity.ok(courseworkService.createRoom(req));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(courseworkService.getAllRooms());
    }

    @DeleteMapping("/rooms/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        courseworkService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    // ── Period Requirements ──
    @PostMapping("/period-requirements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<PeriodRequirementResponse> createPeriodRequirement(@RequestBody PeriodRequirementRequest req) {
        return ResponseEntity.ok(courseworkService.createPeriodRequirement(req));
    }

    @GetMapping("/period-requirements/batch/{batchId}/division/{divisionId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<PeriodRequirementResponse>> getPeriodRequirements(
            @PathVariable Long batchId, @PathVariable Long divisionId) {
        return ResponseEntity.ok(courseworkService.getPeriodRequirements(batchId, divisionId));
    }

    @DeleteMapping("/period-requirements/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deletePeriodRequirement(@PathVariable Long id) {
        courseworkService.deletePeriodRequirement(id);
        return ResponseEntity.noContent().build();
    }

    // ── Generation Requests ──
    @PostMapping("/generation-requests")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<GenerationRequestResponse> createGenerationRequest(@RequestBody GenerationRequestInput req) {
        return ResponseEntity.ok(courseworkService.createGenerationRequest(req));
    }

    @GetMapping("/generation-requests/batch/{batchId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<List<GenerationRequestResponse>> getGenerationRequests(@PathVariable Long batchId) {
        return ResponseEntity.ok(courseworkService.getGenerationRequests(batchId));
    }

    @PutMapping("/generation-requests/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL')")
    public ResponseEntity<GenerationRequestResponse> updateGenerationStatus(
            @PathVariable Long id,
            @RequestParam TimetableGenerationRequest.GenerationStatus status,
            @RequestParam(required = false) String responsePayload,
            @RequestParam(required = false) String errorMessage) {
        return ResponseEntity.ok(courseworkService.updateGenerationRequestStatus(id, status, responsePayload, errorMessage));
    }

    // ── Syllabus ──
    @PostMapping("/syllabus")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<SyllabusResponse> logSyllabus(@RequestBody SyllabusRequest req) {
        return ResponseEntity.ok(courseworkService.logSyllabus(req));
    }

    @GetMapping("/syllabus/division/{divisionId}/subject/{subjectId}")
    public ResponseEntity<List<SyllabusResponse>> getSyllabusLogs(@PathVariable Long divisionId, @PathVariable Long subjectId) {
        return ResponseEntity.ok(courseworkService.getSyllabusLogs(divisionId, subjectId));
    }

    @GetMapping("/syllabus/parent/{parentUserId}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<SyllabusResponse>> getSyllabusForParent(@PathVariable Long parentUserId) {
        return ResponseEntity.ok(courseworkService.getSyllabusForParent(parentUserId));
    }

    // ── Assignments ──
    @PostMapping("/assignments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<AssignmentResponse> createAssignment(@RequestBody AssignmentRequest req) {
        return ResponseEntity.ok(courseworkService.createAssignment(req));
    }

    @GetMapping("/assignments/division/{divisionId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByDivision(@PathVariable Long divisionId) {
        return ResponseEntity.ok(courseworkService.getAssignmentsByDivision(divisionId));
    }

    @GetMapping("/assignments/parent/{parentUserId}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsForParent(@PathVariable Long parentUserId) {
        return ResponseEntity.ok(courseworkService.getAssignmentsForParent(parentUserId));
    }

    @GetMapping("/assignments/faculty/{facultyId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByFaculty(@PathVariable Long facultyId) {
        return ResponseEntity.ok(courseworkService.getAssignmentsByFaculty(facultyId));
    }

    @DeleteMapping("/assignments/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        courseworkService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    // ── Submissions ──
    @PostMapping("/submissions")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<SubmissionResponse> submitAssignment(@RequestBody SubmissionRequest req) {
        return ResponseEntity.ok(courseworkService.submitAssignment(req));
    }

    @GetMapping("/submissions/assignment/{assignmentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(courseworkService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/submissions/student/{studentId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY', 'PARENT')")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(courseworkService.getSubmissionsByStudent(studentId));
    }

    @PutMapping("/submissions/{id}/grade")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'PRINCIPAL', 'FACULTY')")
    public ResponseEntity<SubmissionResponse> gradeSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(courseworkService.gradeSubmission(id));
    }
}
