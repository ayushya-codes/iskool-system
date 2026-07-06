package com.leanquitous.iskool.entity.student;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Student extends BaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "parent_user_id")
    private Long parentUserId;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
