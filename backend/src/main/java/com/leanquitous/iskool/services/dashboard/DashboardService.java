package com.leanquitous.iskool.services.dashboard;

import com.leanquitous.iskool.dto.dashboard.DashboardDtos.*;
import com.leanquitous.iskool.entity.attendance.FacultyLeaveApplication;
import com.leanquitous.iskool.entity.attendance.StudentLeaveApplication;
import com.leanquitous.iskool.entity.finance.Invoice;
import com.leanquitous.iskool.entity.student.Student;
import com.leanquitous.iskool.repositories.attendance.FacultyLeaveApplicationRepository;
import com.leanquitous.iskool.repositories.attendance.StudentLeaveApplicationRepository;
import com.leanquitous.iskool.repositories.finance.InvoiceRepository;
import com.leanquitous.iskool.repositories.student.StudentRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepo;
    private final StudentLeaveApplicationRepository studentLeaveRepo;
    private final FacultyLeaveApplicationRepository facultyLeaveRepo;
    private final InvoiceRepository invoiceRepo;
    private final EntityManager entityManager;

    private static final int ACTIVITY_LIMIT = 10;

    public DashboardResponse getDashboardStats() {
        Long schoolId = TenantContext.getCurrentTenant();
        LocalDate today = LocalDate.now();

        // ── Single native query for all counts (1 DB round trip) ──
        Query countQuery = entityManager.createNativeQuery("""
                SELECT
                    (SELECT COUNT(*) FROM students WHERE school_id = :sid AND is_active = true) AS total_students,
                    (SELECT COUNT(*) FROM faculty WHERE school_id = :sid) AS faculty_members,
                    (SELECT COUNT(*) FROM attendance_records WHERE school_id = :sid AND date = :today) AS att_total,
                    (SELECT COUNT(*) FROM attendance_records WHERE school_id = :sid AND date = :today AND status = 'PRESENT') AS att_present,
                    (SELECT COUNT(*) FROM attendance_records WHERE school_id = :sid AND date = :today AND status = 'ABSENT') AS att_absent,
                    (SELECT COUNT(*) FROM attendance_records WHERE school_id = :sid AND date = :today AND status = 'LEAVE') AS att_leave,
                    (SELECT COUNT(*) FROM invoices WHERE school_id = :sid AND status IN ('PENDING','OVERDUE')) AS pending_fees,
                    (SELECT COUNT(*) FROM exams WHERE school_id = :sid AND exam_date >= :today AND is_active = true) AS upcoming_exams,
                    (SELECT COUNT(*) FROM inventory_items WHERE school_id = :sid AND is_active = true) AS inventory_items,
                    (SELECT COUNT(*) FROM student_leave_applications WHERE school_id = :sid AND status = 'PENDING') AS pending_student_leaves,
                    (SELECT COUNT(*) FROM faculty_leave_applications WHERE school_id = :sid AND status = 'PENDING') AS pending_faculty_leaves
                """);
        countQuery.setParameter("sid", schoolId);
        countQuery.setParameter("today", java.sql.Date.valueOf(today));

        Object[] row = (Object[]) countQuery.getSingleResult();

        long totalStudents = toLong(row[0]);
        long facultyMembers = toLong(row[1]);
        long attTotal = toLong(row[2]);
        long attPresent = toLong(row[3]);
        long attAbsent = toLong(row[4]);
        long attLeave = toLong(row[5]);
        long pendingFees = toLong(row[6]);
        long upcomingExams = toLong(row[7]);
        long inventoryItems = toLong(row[8]);
        long pendingStudentLeaves = toLong(row[9]);
        long pendingFacultyLeaves = toLong(row[10]);

        double attendanceRate = attTotal > 0 ? (attPresent * 100.0 / attTotal) : 0.0;

        AttendanceSummary attendanceSummary = AttendanceSummary.builder()
                .totalRecords(attTotal)
                .presentCount(attPresent)
                .absentCount(attAbsent)
                .leaveCount(attLeave)
                .attendanceRate(Math.round(attendanceRate * 100.0) / 100.0)
                .build();

        // ── Activity feed: limited queries (max 10 rows each, sorted by date desc) ──
        List<RecentActivity> activities = buildRecentActivities(schoolId);

        return DashboardResponse.builder()
                .totalStudents(totalStudents)
                .facultyMembers(facultyMembers)
                .attendanceToday(attendanceSummary)
                .pendingFees(pendingFees)
                .upcomingExams(upcomingExams)
                .inventoryItems(inventoryItems)
                .pendingStudentLeaves(pendingStudentLeaves)
                .pendingFacultyLeaves(pendingFacultyLeaves)
                .recentActivities(activities)
                .build();
    }

    private List<RecentActivity> buildRecentActivities(Long schoolId) {
        List<RecentActivity> activities = new ArrayList<>();

        // Student leaves — top 10 by date desc
        List<StudentLeaveApplication> studentLeaves = studentLeaveRepo
                .findBySchoolIdAndStatusOrderByStartDateDesc(schoolId,
                        StudentLeaveApplication.LeaveStatus.PENDING,
                        PageRequest.of(0, ACTIVITY_LIMIT));

        // Batch-fetch student names (single query)
        Set<Long> studentIds = studentLeaves.stream()
                .map(StudentLeaveApplication::getStudentId)
                .collect(Collectors.toSet());
        Map<Long, String> studentNames = studentIds.isEmpty()
                ? Collections.emptyMap()
                : studentRepo.findAllById(studentIds).stream()
                        .collect(Collectors.toMap(Student::getId,
                                s -> s.getFirstName() + " " + s.getLastName()));

        for (StudentLeaveApplication leave : studentLeaves) {
            String name = studentNames.getOrDefault(leave.getStudentId(),
                    "Student #" + leave.getStudentId());
            activities.add(RecentActivity.builder()
                    .type("STUDENT_LEAVE")
                    .description(name + " applied for " + leave.getLeaveType() + " leave")
                    .date(leave.getStartDate())
                    .status("PENDING")
                    .build());
        }

        // Faculty leaves — top 10 by date desc
        List<FacultyLeaveApplication> facultyLeaves = facultyLeaveRepo
                .findBySchoolIdAndStatusOrderByStartDateDesc(schoolId,
                        StudentLeaveApplication.LeaveStatus.PENDING,
                        PageRequest.of(0, ACTIVITY_LIMIT));
        for (FacultyLeaveApplication leave : facultyLeaves) {
            activities.add(RecentActivity.builder()
                    .type("FACULTY_LEAVE")
                    .description("Faculty #" + leave.getFacultyId() + " applied for " + leave.getLeaveType() + " leave")
                    .date(leave.getStartDate())
                    .status("PENDING")
                    .build());
        }

        // Pending invoices — top 10 by due date desc
        List<Invoice> pendingInvoices = invoiceRepo
                .findBySchoolIdAndStatusOrderByDueDateDesc(schoolId,
                        Invoice.InvoiceStatus.PENDING,
                        PageRequest.of(0, ACTIVITY_LIMIT));
        for (Invoice invoice : pendingInvoices) {
            activities.add(RecentActivity.builder()
                    .type("PENDING_FEE")
                    .description("Invoice " + invoice.getInvoiceNumber() + " pending (₹" + invoice.getTotalAmount() + ")")
                    .date(invoice.getDueDate())
                    .status("PENDING")
                    .build());
        }

        // Sort all activities by date desc, keep top 10
        activities.sort(Comparator.comparing(RecentActivity::getDate, Comparator.nullsLast(Comparator.reverseOrder())));
        if (activities.size() > ACTIVITY_LIMIT) {
            return activities.subList(0, ACTIVITY_LIMIT);
        }
        return activities;
    }

    private static long toLong(Object value) {
        if (value == null) return 0;
        if (value instanceof BigInteger) return ((BigInteger) value).longValue();
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        return Long.parseLong(value.toString());
    }
}
