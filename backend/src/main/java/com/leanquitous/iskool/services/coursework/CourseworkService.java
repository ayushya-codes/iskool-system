package com.leanquitous.iskool.services.coursework;

import com.leanquitous.iskool.dto.coursework.CourseworkDtos.*;
import com.leanquitous.iskool.entity.coursework.*;
import com.leanquitous.iskool.entity.student.Student;
import com.leanquitous.iskool.entity.student.StudentEnrollment;
import com.leanquitous.iskool.repositories.coursework.*;
import com.leanquitous.iskool.repositories.student.StudentEnrollmentRepository;
import com.leanquitous.iskool.repositories.student.StudentRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseworkService {

    private final ClassTimetableRepository timetableRepo;
    private final TimetableSlotRepository slotRepo;
    private final RoomRepository roomRepo;
    private final SubjectPeriodRequirementRepository periodReqRepo;
    private final TimetableGenerationRequestRepository genReqRepo;
    private final SyllabusLogRepository syllabusRepo;
    private final AssignmentRepository assignmentRepo;
    private final AssignmentSubmissionRepository submissionRepo;
    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;

    // ── Timetable ──

    public TimetableResponse createTimetable(TimetableRequest req) {
        ClassTimetable t = ClassTimetable.builder()
                .classId(req.getClassId()).batchId(req.getBatchId()).name(req.getName())
                .isShared(req.getIsShared() != null ? req.getIsShared() : false)
                .isPublished(false).schoolId(TenantContext.getCurrentTenant()).build();
        return TimetableResponse.from(timetableRepo.save(t));
    }

    public List<TimetableResponse> getTimetablesByBatch(Long batchId) {
        return timetableRepo.findBySchoolIdAndBatchId(TenantContext.getCurrentTenant(), batchId)
                .stream().map(TimetableResponse::from).toList();
    }

    public TimetableResponse publishTimetable(Long id) {
        ClassTimetable t = timetableRepo.findById(id).orElseThrow(() -> new RuntimeException("Timetable not found"));
        t.setIsPublished(true);
        return TimetableResponse.from(timetableRepo.save(t));
    }

    // ── Slots ──

    public SlotResponse createSlot(SlotRequest req) {
        TimetableSlot slot = TimetableSlot.builder()
                .timetableId(req.getTimetableId()).divisionId(req.getDivisionId())
                .dayOfWeek(req.getDayOfWeek()).periodNumber(req.getPeriodNumber())
                .subjectId(req.getSubjectId()).facultyId(req.getFacultyId()).roomId(req.getRoomId())
                .startTime(req.getStartTime()).endTime(req.getEndTime())
                .slotType(req.getSlotType()).schoolId(TenantContext.getCurrentTenant()).build();
        return SlotResponse.from(slotRepo.save(slot));
    }

    public List<SlotResponse> getSlotsByDivision(Long divisionId) {
        return slotRepo.findBySchoolIdAndDivisionIdOrderByDayOfWeekAscPeriodNumberAsc(
                        TenantContext.getCurrentTenant(), divisionId).stream().map(SlotResponse::from).toList();
    }

    public List<SlotResponse> getSlotsByTimetable(Long timetableId) {
        return slotRepo.findBySchoolIdAndTimetableIdOrderByDayOfWeekAscPeriodNumberAsc(
                        TenantContext.getCurrentTenant(), timetableId).stream().map(SlotResponse::from).toList();
    }

    public List<SlotResponse> getFacultySlotsByDay(Long facultyId, Integer dayOfWeek) {
        return slotRepo.findBySchoolIdAndFacultyIdAndDayOfWeekOrderByStartTimeAsc(
                        TenantContext.getCurrentTenant(), facultyId, dayOfWeek).stream().map(SlotResponse::from).toList();
    }

    public void deleteSlot(Long id) { slotRepo.deleteById(id); }

    // ── Room ──

    public RoomResponse createRoom(RoomRequest req) {
        Room room = Room.builder().name(req.getName()).roomType(req.getRoomType())
                .capacity(req.getCapacity()).schoolId(TenantContext.getCurrentTenant()).build();
        return RoomResponse.from(roomRepo.save(room));
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepo.findBySchoolId(TenantContext.getCurrentTenant()).stream().map(RoomResponse::from).toList();
    }

    public void deleteRoom(Long id) { roomRepo.deleteById(id); }

    // ── Period Requirements ──

    public PeriodRequirementResponse createPeriodRequirement(PeriodRequirementRequest req) {
        SubjectPeriodRequirement r = SubjectPeriodRequirement.builder()
                .divisionId(req.getDivisionId()).subjectId(req.getSubjectId()).batchId(req.getBatchId())
                .periodsPerWeek(req.getPeriodsPerWeek()).requiresLab(req.getRequiresLab())
                .preferredDaySpread(req.getPreferredDaySpread()).schoolId(TenantContext.getCurrentTenant()).build();
        return PeriodRequirementResponse.from(periodReqRepo.save(r));
    }

    public List<PeriodRequirementResponse> getPeriodRequirements(Long batchId, Long divisionId) {
        return periodReqRepo.findBySchoolIdAndBatchIdAndDivisionId(
                        TenantContext.getCurrentTenant(), batchId, divisionId)
                .stream().map(PeriodRequirementResponse::from).toList();
    }

    public void deletePeriodRequirement(Long id) { periodReqRepo.deleteById(id); }

    // ── Generation Requests ──

    public GenerationRequestResponse createGenerationRequest(GenerationRequestInput req) {
        TimetableGenerationRequest r = TimetableGenerationRequest.builder()
                .classId(req.getClassId()).batchId(req.getBatchId()).generatedByUserId(req.getGeneratedByUserId())
                .status(TimetableGenerationRequest.GenerationStatus.PENDING)
                .aiModelUsed(req.getAiModelUsed()).requestPayload(req.getRequestPayload())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return GenerationRequestResponse.from(genReqRepo.save(r));
    }

    public List<GenerationRequestResponse> getGenerationRequests(Long batchId) {
        return genReqRepo.findBySchoolIdAndBatchIdOrderByCreatedAtDesc(TenantContext.getCurrentTenant(), batchId)
                .stream().map(GenerationRequestResponse::from).toList();
    }

    public GenerationRequestResponse updateGenerationRequestStatus(Long id, TimetableGenerationRequest.GenerationStatus status,
                                                                    String responsePayload, String errorMessage) {
        TimetableGenerationRequest r = genReqRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Generation request not found"));
        r.setStatus(status);
        if (responsePayload != null) r.setResponsePayload(responsePayload);
        if (errorMessage != null) r.setErrorMessage(errorMessage);
        return GenerationRequestResponse.from(genReqRepo.save(r));
    }

    // ── Syllabus ──

    public SyllabusResponse logSyllabus(SyllabusRequest req) {
        SyllabusLog log = SyllabusLog.builder()
                .divisionId(req.getDivisionId()).subjectId(req.getSubjectId()).date(req.getDate())
                .content(req.getContent()).loggedByFacultyId(req.getLoggedByFacultyId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return SyllabusResponse.from(syllabusRepo.save(log));
    }

    public List<SyllabusResponse> getSyllabusLogs(Long divisionId, Long subjectId) {
        return syllabusRepo.findBySchoolIdAndDivisionIdAndSubjectIdOrderByDateDesc(
                        TenantContext.getCurrentTenant(), divisionId, subjectId)
                .stream().map(SyllabusResponse::from).toList();
    }

    public List<SyllabusResponse> getSyllabusForParent(Long parentUserId) {
        Long schoolId = TenantContext.getCurrentTenant();
        Student child = studentRepository.findByParentUserIdAndSchoolIdAndIsActiveTrue(parentUserId, schoolId)
                .orElseThrow(() -> new RuntimeException("No active child found for parent"));
        List<StudentEnrollment> enrollments = enrollmentRepository.findBySchoolIdAndStudentId(schoolId, child.getId());
        if (enrollments.isEmpty()) {
            return List.of();
        }
        List<Long> divisionIds = enrollments.stream().map(StudentEnrollment::getDivisionId).distinct().toList();
        return syllabusRepo.findBySchoolIdAndDivisionIdInOrderByDateDesc(schoolId, divisionIds)
                .stream().map(SyllabusResponse::from).toList();
    }

    // ── Assignments ──

    public AssignmentResponse createAssignment(AssignmentRequest req) {
        Assignment a = Assignment.builder()
                .divisionId(req.getDivisionId()).subjectId(req.getSubjectId()).title(req.getTitle())
                .description(req.getDescription()).attachmentUrl(req.getAttachmentUrl())
                .dueDate(req.getDueDate()).createdByFacultyId(req.getCreatedByFacultyId())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return AssignmentResponse.from(assignmentRepo.save(a));
    }

    public List<AssignmentResponse> getAssignmentsByDivision(Long divisionId) {
        return assignmentRepo.findBySchoolIdAndDivisionIdOrderByDueDateDesc(
                        TenantContext.getCurrentTenant(), divisionId).stream().map(AssignmentResponse::from).toList();
    }

    public List<AssignmentResponse> getAssignmentsForParent(Long parentUserId) {
        Long schoolId = TenantContext.getCurrentTenant();
        Student child = studentRepository.findByParentUserIdAndSchoolIdAndIsActiveTrue(parentUserId, schoolId)
                .orElseThrow(() -> new RuntimeException("No active child found for parent"));
        List<StudentEnrollment> enrollments = enrollmentRepository.findBySchoolIdAndStudentId(schoolId, child.getId());
        if (enrollments.isEmpty()) {
            return List.of();
        }
        List<Long> divisionIds = enrollments.stream().map(StudentEnrollment::getDivisionId).distinct().toList();
        return assignmentRepo.findBySchoolIdAndDivisionIdInOrderByDueDateDesc(schoolId, divisionIds)
                .stream().map(AssignmentResponse::from).toList();
    }

    public List<AssignmentResponse> getAssignmentsByFaculty(Long facultyId) {
        return assignmentRepo.findBySchoolIdAndCreatedByFacultyIdOrderByDueDateDesc(
                        TenantContext.getCurrentTenant(), facultyId).stream().map(AssignmentResponse::from).toList();
    }

    public void deleteAssignment(Long id) { assignmentRepo.deleteById(id); }

    // ── Submissions ──

    public SubmissionResponse submitAssignment(SubmissionRequest req) {
        AssignmentSubmission s = AssignmentSubmission.builder()
                .assignmentId(req.getAssignmentId()).studentId(req.getStudentId())
                .status(AssignmentSubmission.SubmissionStatus.SUBMITTED).submittedAt(LocalDateTime.now())
                .schoolId(TenantContext.getCurrentTenant()).build();
        return SubmissionResponse.from(submissionRepo.save(s));
    }

    public List<SubmissionResponse> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepo.findBySchoolIdAndAssignmentId(TenantContext.getCurrentTenant(), assignmentId)
                .stream().map(SubmissionResponse::from).toList();
    }

    public List<SubmissionResponse> getSubmissionsByStudent(Long studentId) {
        return submissionRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(SubmissionResponse::from).toList();
    }

    public SubmissionResponse gradeSubmission(Long id) {
        AssignmentSubmission s = submissionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        s.setStatus(AssignmentSubmission.SubmissionStatus.GRADED);
        return SubmissionResponse.from(submissionRepo.save(s));
    }
}
