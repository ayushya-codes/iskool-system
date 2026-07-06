package com.leanquitous.iskool.services.student;

import com.leanquitous.iskool.dto.student.StudentDtos.*;
import com.leanquitous.iskool.entity.student.*;
import com.leanquitous.iskool.entity.user.User;
import com.leanquitous.iskool.repositories.academic.DivisionRepository;
import com.leanquitous.iskool.repositories.student.*;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepo;
    private final StudentMedicalProfileRepository medicalRepo;
    private final StudentEnrollmentRepository enrollmentRepo;
    private final StudentEmergencyContactRepository emergencyRepo;
    private final StudentSiblingLinkRepository siblingRepo;
    private final StudentTimelineRepository timelineRepo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DivisionRepository divisionRepo;

    // ── Student CRUD ──

    public StudentResponse create(StudentRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        Long parentUserId = resolveParentUserId(req, schoolId);

        Student student = Student.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .avatarUrl(req.getAvatarUrl())
                .admissionDate(req.getAdmissionDate())
                .schoolId(schoolId)
                .parentUserId(parentUserId)
                .build();
        Student saved = studentRepo.save(student);
        autoGenerateAdmissionTimeline(saved, schoolId);
        return StudentResponse.from(saved);
    }

    public StudentResponse getById(Long id) {
        return StudentResponse.from(findStudent(id));
    }

    public List<StudentResponse> getAll() {
        return studentRepo.findBySchoolIdAndIsActiveTrueOrderByFirstNameAsc(TenantContext.getCurrentTenant())
                .stream().map(StudentResponse::from).toList();
    }

    public List<StudentResponse> getFiltered(Long batchId, Long classId, Long divisionId) {
        Long schoolId = TenantContext.getCurrentTenant();

        if (divisionId != null) {
            List<StudentEnrollment> enrollments = batchId != null
                    ? enrollmentRepo.findBySchoolIdAndDivisionIdAndBatchId(schoolId, divisionId, batchId)
                    : enrollmentRepo.findBySchoolIdAndDivisionIdIn(schoolId, List.of(divisionId));
            Set<Long> studentIds = enrollments.stream().map(StudentEnrollment::getStudentId).collect(Collectors.toSet());
            return studentRepo.findAllById(studentIds).stream().map(StudentResponse::from).toList();
        }

        if (classId != null) {
            List<Long> divisionIds = divisionRepo.findBySchoolIdAndClassIdOrderByNameAsc(schoolId, classId)
                    .stream().map(d -> d.getId()).toList();
            if (divisionIds.isEmpty()) return List.of();
            List<StudentEnrollment> enrollments = batchId != null
                    ? enrollmentRepo.findBySchoolIdAndDivisionIdInAndBatchId(schoolId, divisionIds, batchId)
                    : enrollmentRepo.findBySchoolIdAndDivisionIdIn(schoolId, divisionIds);
            Set<Long> studentIds = enrollments.stream().map(StudentEnrollment::getStudentId).collect(Collectors.toSet());
            return studentRepo.findAllById(studentIds).stream().map(StudentResponse::from).toList();
        }

        if (batchId != null) {
            List<StudentEnrollment> enrollments = enrollmentRepo.findBySchoolIdAndBatchId(schoolId, batchId);
            Set<Long> studentIds = enrollments.stream().map(StudentEnrollment::getStudentId).collect(Collectors.toSet());
            return studentRepo.findAllById(studentIds).stream().map(StudentResponse::from).toList();
        }

        return getAll();
    }

    public StudentResponse update(Long id, StudentRequest req) {
        Student student = findStudent(id);
        if (req.getFirstName() != null) student.setFirstName(req.getFirstName());
        if (req.getLastName() != null) student.setLastName(req.getLastName());
        if (req.getDateOfBirth() != null) student.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) student.setGender(req.getGender());
        if (req.getAvatarUrl() != null) student.setAvatarUrl(req.getAvatarUrl());
        if (req.getAdmissionDate() != null) student.setAdmissionDate(req.getAdmissionDate());
        if (req.getParentUserId() != null || req.getParentEmail() != null) {
            Long parentUserId = resolveParentUserId(req, student.getSchoolId());
            student.setParentUserId(parentUserId);
        }
        return StudentResponse.from(studentRepo.save(student));
    }

    public void delete(Long id) {
        Student student = findStudent(id);
        student.setIsActive(false);
        studentRepo.save(student);
    }

    public StudentDetailResponse getDetail(Long id) {
        Long schoolId = TenantContext.getCurrentTenant();
        StudentResponse student = StudentResponse.from(findStudent(id));
        MedicalResponse medical = medicalRepo.findBySchoolIdAndStudentId(schoolId, id)
                .map(MedicalResponse::from).orElse(null);
        List<EmergencyContactResponse> contacts = emergencyRepo.findBySchoolIdAndStudentId(schoolId, id)
                .stream().map(EmergencyContactResponse::from).toList();
        List<EnrollmentResponse> enrollments = enrollmentRepo.findBySchoolIdAndStudentId(schoolId, id)
                .stream().map(EnrollmentResponse::from).toList();
        List<TimelineResponse> timeline = timelineRepo.findBySchoolIdAndStudentIdOrderByEventDateDesc(schoolId, id)
                .stream().map(TimelineResponse::from).toList();
        return StudentDetailResponse.builder()
                .student(student).medical(medical)
                .emergencyContacts(contacts).enrollments(enrollments).timeline(timeline)
                .build();
    }

    // ── Medical ──

    public MedicalResponse upsertMedical(Long studentId, MedicalRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        StudentMedicalProfile medical = medicalRepo.findBySchoolIdAndStudentId(schoolId, studentId)
                .orElseGet(() -> StudentMedicalProfile.builder()
                        .studentId(studentId).schoolId(schoolId).build());
        if (req.getBloodGroup() != null) medical.setBloodGroup(req.getBloodGroup());
        if (req.getAllergies() != null) medical.setAllergies(req.getAllergies());
        if (req.getAsthma() != null) medical.setAsthma(req.getAsthma());
        if (req.getChronicConditions() != null) medical.setChronicConditions(req.getChronicConditions());
        if (req.getMedications() != null) medical.setMedications(req.getMedications());
        if (req.getDoctorNotes() != null) medical.setDoctorNotes(req.getDoctorNotes());
        return MedicalResponse.from(medicalRepo.save(medical));
    }

    // ── Enrollment ──

    public EnrollmentResponse enroll(Long studentId, EnrollmentRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        StudentEnrollment enrollment = StudentEnrollment.builder()
                .studentId(studentId)
                .divisionId(req.getDivisionId())
                .batchId(req.getBatchId())
                .rollNumber(req.getRollNumber())
                .schoolId(schoolId)
                .build();
        StudentEnrollment saved = enrollmentRepo.save(enrollment);
        autoGenerateEnrollmentTimeline(studentId, req, schoolId);
        return EnrollmentResponse.from(saved);
    }

    public List<EnrollmentResponse> getEnrollments(Long studentId) {
        return enrollmentRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(EnrollmentResponse::from).toList();
    }

    // ── Emergency Contacts ──

    public EmergencyContactResponse addEmergencyContact(Long studentId, EmergencyContactRequest req) {
        StudentEmergencyContact contact = StudentEmergencyContact.builder()
                .studentId(studentId)
                .contactName(req.getContactName())
                .relationship(req.getRelationship())
                .phoneNumber(req.getPhoneNumber())
                .isPrimary(req.getIsPrimary() != null ? req.getIsPrimary() : false)
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return EmergencyContactResponse.from(emergencyRepo.save(contact));
    }

    public List<EmergencyContactResponse> getEmergencyContacts(Long studentId) {
        return emergencyRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId)
                .stream().map(EmergencyContactResponse::from).toList();
    }

    public void deleteEmergencyContact(Long contactId) {
        emergencyRepo.deleteById(contactId);
    }

    // ── Siblings ──

    public void addSibling(Long studentId, SiblingLinkRequest req) {
        StudentSiblingLink link = StudentSiblingLink.builder()
                .studentId(studentId)
                .siblingStudentId(req.getSiblingStudentId())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        siblingRepo.save(link);
    }

    public List<StudentSiblingLink> getSiblings(Long studentId) {
        return siblingRepo.findBySchoolIdAndStudentId(TenantContext.getCurrentTenant(), studentId);
    }

    public void removeSibling(Long linkId) {
        siblingRepo.deleteById(linkId);
    }

    // ── Timeline ──

    public TimelineResponse addTimelineEvent(Long studentId, TimelineRequest req) {
        StudentTimeline event = StudentTimeline.builder()
                .studentId(studentId)
                .eventType(req.getEventType())
                .eventDate(req.getEventDate())
                .title(req.getTitle())
                .description(req.getDescription())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return TimelineResponse.from(timelineRepo.save(event));
    }

    public List<TimelineResponse> getTimeline(Long studentId) {
        return timelineRepo.findBySchoolIdAndStudentIdOrderByEventDateDesc(TenantContext.getCurrentTenant(), studentId)
                .stream().map(TimelineResponse::from).toList();
    }

    public Student findByParentUserId(Long parentUserId, Long schoolId) {
        return studentRepo.findByParentUserIdAndSchoolIdAndIsActiveTrue(parentUserId, schoolId)
                .orElseThrow(() -> new RuntimeException("No student linked to your account"));
    }

    private Long resolveParentUserId(StudentRequest req, Long schoolId) {
        if (req.getParentUserId() != null) {
            User parent = userRepository.findById(req.getParentUserId())
                    .orElseThrow(() -> new RuntimeException("Parent user not found"));
            if (parent.getRole() != User.Role.PARENT) {
                throw new RuntimeException("Specified user is not a parent");
            }
            return parent.getId();
        }

        if (req.getParentEmail() != null && !req.getParentEmail().isBlank()) {
            String email = req.getParentEmail().trim();
            Optional<User> existing = userRepository.findByEmailAndSchoolId(email, schoolId);
            if (existing.isPresent()) {
                return existing.get().getId();
            }

            String tempPassword = UUID.randomUUID().toString().substring(0, 8);
            User newParent = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(tempPassword))
                    .fullName(req.getParentName() != null ? req.getParentName() : email)
                    .role(User.Role.PARENT)
                    .mobileNumber(req.getParentMobile())
                    .isActive(true)
                    .schoolId(schoolId)
                    .build();

            User saved = userRepository.save(newParent);
            // TODO: Send welcome email with temporary password
            return saved.getId();
        }

        return null;
    }

    // ── Auto Timeline Generation ──

    private void autoGenerateAdmissionTimeline(Student student, Long schoolId) {
        StudentTimeline timeline = StudentTimeline.builder()
                .studentId(student.getId())
                .eventType("ADMISSION")
                .eventDate(student.getAdmissionDate() != null ? student.getAdmissionDate() : LocalDate.now())
                .title("Admitted to School")
                .description(student.getFirstName() + " " + student.getLastName() + " was admitted to the school.")
                .schoolId(schoolId)
                .build();
        timelineRepo.save(timeline);
    }

    private void autoGenerateEnrollmentTimeline(Long studentId, EnrollmentRequest req, Long schoolId) {
        StudentTimeline timeline = StudentTimeline.builder()
                .studentId(studentId)
                .eventType("ENROLLMENT")
                .eventDate(LocalDate.now())
                .title("Enrolled in Batch")
                .description("Enrolled with roll number " + (req.getRollNumber() != null ? req.getRollNumber() : "N/A"))
                .schoolId(schoolId)
                .build();
        timelineRepo.save(timeline);
    }

    // ── Helper ──

    private Student findStudent(Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        TenantValidator.validateOwnership(student.getSchoolId());
        return student;
    }
}
