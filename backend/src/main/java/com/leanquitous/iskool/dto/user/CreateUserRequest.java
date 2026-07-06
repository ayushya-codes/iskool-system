package com.leanquitous.iskool.dto.user;

import com.leanquitous.iskool.entity.user.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Role is required")
    private User.Role role;

    private String mobileNumber;

    public User toEntity(String passwordHash, Long schoolId) {
        return User.builder()
                .email(email)
                .passwordHash(passwordHash)
                .fullName(fullName)
                .role(role)
                .mobileNumber(mobileNumber)
                .schoolId(schoolId)
                .isActive(true)
                .build();
    }
}
