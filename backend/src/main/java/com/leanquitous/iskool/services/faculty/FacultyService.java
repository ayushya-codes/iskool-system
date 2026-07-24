package com.leanquitous.iskool.services.faculty;

import com.leanquitous.iskool.dto.faculty.FacultyDtos.*;
import com.leanquitous.iskool.entity.faculty.*;
import com.leanquitous.iskool.entity.user.User;
import com.leanquitous.iskool.repositories.faculty.*;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepo;
    private final FacultyClassAssignmentRepository assignmentRepo;
    private final FacultyAttendanceRepository attendanceRepo;
    private final FacultyAvailabilityRepository availabilityRepo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Faculty CRUD ──

    public FacultyResponse create(FacultyRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        Long userId = resolveUserId(req, schoolId);

        Faculty faculty = Faculty.builder()
                .userId(userId)
                .employeeId(req.getEmployeeId())
                .certifications(req.getCertifications())
                .maxWeeklyLectures(req.getMaxWeeklyLectures())
                .schoolId(schoolId)
                .build();
        Faculty saved = facultyRepo.save(faculty);
        User user = userRepository.findById(userId).orElse(null);
        return FacultyResponse.from(saved, user);
    }

    public FacultyResponse getById(Long id) {
        Faculty faculty = findFaculty(id);
        User user = userRepository.findById(faculty.getUserId()).orElse(null);
        return FacultyResponse.from(faculty, user);
    }

    public List<FacultyResponse> getAll() {
        Long schoolId = TenantContext.getCurrentTenant();
        List<Faculty> faculties = facultyRepo.findBySchoolId(schoolId);
        if (faculties.isEmpty()) return List.of();
        Set<Long> userIds = faculties.stream().map(Faculty::getUserId).collect(Collectors.toSet());
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));
        return faculties.stream()
                .map(f -> FacultyResponse.from(f, userMap.get(f.getUserId())))
                .toList();
    }

    public FacultyResponse update(Long id, FacultyRequest req) {
        Faculty faculty = findFaculty(id);
        if (req.getEmployeeId() != null) faculty.setEmployeeId(req.getEmployeeId());
        if (req.getCertifications() != null) faculty.setCertifications(req.getCertifications());
        if (req.getMaxWeeklyLectures() != null) faculty.setMaxWeeklyLectures(req.getMaxWeeklyLectures());
        Faculty saved = facultyRepo.save(faculty);

        User user = userRepository.findById(faculty.getUserId()).orElse(null);
        if (user != null) {
            if (req.getFullName() != null) user.setFullName(req.getFullName());
            if (req.getEmail() != null) user.setEmail(req.getEmail());
            if (req.getMobileNumber() != null) user.setMobileNumber(req.getMobileNumber());
            if (req.getPassword() != null && !req.getPassword().isBlank()) {
                user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
            }
            userRepository.save(user);
        }

        return FacultyResponse.from(saved, user);
    }

    public void delete(Long id) {
        Faculty faculty = findFaculty(id);
        facultyRepo.delete(faculty);
    }

    // ── Class Assignments ──

    public ClassAssignmentResponse assignClass(Long facultyId, ClassAssignmentRequest req) {
        FacultyClassAssignment assignment = FacultyClassAssignment.builder()
                .facultyId(facultyId)
                .divisionId(req.getDivisionId())
                .subjectId(req.getSubjectId())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return ClassAssignmentResponse.from(assignmentRepo.save(assignment));
    }

    public List<ClassAssignmentResponse> getAssignments(Long facultyId) {
        return assignmentRepo.findBySchoolIdAndFacultyId(TenantContext.getCurrentTenant(), facultyId)
                .stream().map(ClassAssignmentResponse::from).toList();
    }

    public void removeAssignment(Long assignmentId) {
        FacultyClassAssignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        TenantValidator.validateOwnership(assignment.getSchoolId());
        assignmentRepo.delete(assignment);
    }

    // ── Attendance ──

    public FacultyAttendanceResponse clockIn(Long facultyId, ClockInRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        FacultyAttendance attendance = attendanceRepo
                .findBySchoolIdAndFacultyIdAndDate(schoolId, facultyId, req.getDate())
                .orElseGet(() -> FacultyAttendance.builder()
                        .facultyId(facultyId)
                        .date(req.getDate())
                        .schoolId(schoolId)
                        .build());
        attendance.setClockIn(req.getClockIn());
        return FacultyAttendanceResponse.from(attendanceRepo.save(attendance));
    }

    public FacultyAttendanceResponse clockOut(Long facultyId, ClockOutRequest req) {
        Long schoolId = TenantContext.getCurrentTenant();
        FacultyAttendance attendance = attendanceRepo
                .findBySchoolIdAndFacultyIdAndDate(schoolId, facultyId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No clock-in record for today"));
        attendance.setClockOut(req.getClockOut());
        return FacultyAttendanceResponse.from(attendanceRepo.save(attendance));
    }

    public List<FacultyAttendanceResponse> getAttendanceRange(Long facultyId, LocalDate from, LocalDate to) {
        return attendanceRepo.findBySchoolIdAndFacultyIdAndDateBetween(
                        TenantContext.getCurrentTenant(), facultyId, from, to)
                .stream().map(FacultyAttendanceResponse::from).toList();
    }

    // ── Availability ──

    public AvailabilityResponse setAvailability(Long facultyId, AvailabilityRequest req) {
        FacultyAvailability availability = FacultyAvailability.builder()
                .facultyId(facultyId)
                .dayOfWeek(req.getDayOfWeek())
                .availableFrom(req.getAvailableFrom())
                .availableTo(req.getAvailableTo())
                .isPreferredSlot(req.getIsPreferredSlot())
                .notes(req.getNotes())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return AvailabilityResponse.from(availabilityRepo.save(availability));
    }

    public List<AvailabilityResponse> getAvailability(Long facultyId) {
        return availabilityRepo.findBySchoolIdAndFacultyId(TenantContext.getCurrentTenant(), facultyId)
                .stream().map(AvailabilityResponse::from).toList();
    }

    public void removeAvailability(Long availabilityId) {
        FacultyAvailability availability = availabilityRepo.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability not found"));
        TenantValidator.validateOwnership(availability.getSchoolId());
        availabilityRepo.delete(availability);
    }

    // ── Helper ──

    private Long resolveUserId(FacultyRequest req, Long schoolId) {
        if (req.getUserId() != null) {
            return req.getUserId();
        }

        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new RuntimeException("Either userId or email must be provided");
        }

        String email = req.getEmail().trim();
        User existing = userRepository.findByEmailAndSchoolId(email, schoolId).orElse(null);
        if (existing != null) {
            return existing.getId();
        }

        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required to create a new user");
        }

        String password = (req.getPassword() != null && !req.getPassword().isBlank())
                ? req.getPassword()
                : UUID.randomUUID().toString().substring(0, 8);

        User newUser = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(req.getFullName())
                .role(User.Role.FACULTY)
                .mobileNumber(req.getMobileNumber())
                .isActive(true)
                .schoolId(schoolId)
                .build();
        User saved = userRepository.save(newUser);
        // TODO: Send welcome email with temporary password
        return saved.getId();
    }

    private Faculty findFaculty(Long id) {
        Faculty faculty = facultyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        TenantValidator.validateOwnership(faculty.getSchoolId());
        return faculty;
    }
}
