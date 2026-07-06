package com.leanquitous.iskool.entity.user;

import com.leanquitous.iskool.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "mobile_number")
    private String mobileNumber;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    public enum Role {
        PARENT, FACULTY, SUPERVISOR, PRINCIPAL, SCHOOL_ADMIN, SUPER_ADMIN, GATE_KEEPER,
        CLERK, HELPDESK, SCHOOL_TRUSTEE
    }
}
