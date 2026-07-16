package com.leanquitous.iskool.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class DashboardDtos {

    @Data
    @Builder
    @AllArgsConstructor
    public static class DashboardResponse {
        private long totalStudents;
        private long facultyMembers;
        private AttendanceSummary attendanceToday;
        private long pendingFees;
        private long upcomingExams;
        private long inventoryItems;
        private long pendingStudentLeaves;
        private long pendingFacultyLeaves;
        private List<RecentActivity> recentActivities;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class AttendanceSummary {
        private long totalRecords;
        private long presentCount;
        private long absentCount;
        private long leaveCount;
        private double attendanceRate;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class RecentActivity {
        private String type;
        private String description;
        private LocalDate date;
        private String status;
    }
}
