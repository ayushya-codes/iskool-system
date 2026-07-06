package com.leanquitous.iskool.services.faculty;

import com.leanquitous.iskool.dto.faculty.FacultyDtos.*;
import com.leanquitous.iskool.entity.faculty.*;
import com.leanquitous.iskool.repositories.faculty.*;
import com.leanquitous.iskool.tenant.TenantContext;
import com.leanquitous.iskool.tenant.TenantValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepo;
    private final FacultyClassAssignmentRepository assignmentRepo;
    private final FacultyAttendanceRepository attendanceRepo;
    private final FacultyAvailabilityRepository availabilityRepo;

    // ── Faculty CRUD ──

    public FacultyResponse create(FacultyRequest req) {
        Faculty faculty = Faculty.builder()
                .userId(req.getUserId())
                .employeeId(req.getEmployeeId())
                .certifications(req.getCertifications())
                .maxWeeklyLectures(req.getMaxWeeklyLectures())
                .schoolId(TenantContext.getCurrentTenant())
                .build();
        return FacultyResponse.from(facultyRepo.save(faculty));
    }

    public FacultyResponse getById(Long id) {
        return FacultyResponse.from(findFaculty(id));
    }

    public List<FacultyResponse> getAll() {
        return facultyRepo.findBySchoolId(TenantContext.getCurrentTenant())
                .stream().map(FacultyResponse::from).toList();
    }

    public FacultyResponse update(Long id, FacultyRequest req) {
        Faculty faculty = findFaculty(id);
        if (req.getEmployeeId() != null) faculty.setEmployeeId(req.getEmployeeId());
        if (req.getCertifications() != null) faculty.setCertifications(req.getCertifications());
        if (req.getMaxWeeklyLectures() != null) faculty.setMaxWeeklyLectures(req.getMaxWeeklyLectures());
        return FacultyResponse.from(facultyRepo.save(faculty));
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

    private Faculty findFaculty(Long id) {
        Faculty faculty = facultyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        TenantValidator.validateOwnership(faculty.getSchoolId());
        return faculty;
    }
}
