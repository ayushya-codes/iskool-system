package com.leanquitous.iskool.entity.student;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "student_medical_profiles",
       uniqueConstraints = @UniqueConstraint(columnNames = {"school_id", "student_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudentMedicalProfile extends BaseEntity {

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "asthma")
    private Boolean asthma;

    @Column(name = "chronic_conditions")
    private String chronicConditions;

    @Column(name = "medications")
    private String medications;

    @Column(name = "doctor_notes")
    private String doctorNotes;
}
