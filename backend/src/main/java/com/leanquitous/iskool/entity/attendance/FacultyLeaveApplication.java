package com.leanquitous.iskool.entity.attendance;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "faculty_leave_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FacultyLeaveApplication extends BaseEntity {

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "leave_type", nullable = false)
    private String leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StudentLeaveApplication.LeaveStatus status;

    @Column(name = "approved_by_user_id")
    private Long approvedByUserId;
}
