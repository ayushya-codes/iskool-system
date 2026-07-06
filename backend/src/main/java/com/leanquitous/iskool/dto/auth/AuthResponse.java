package com.leanquitous.iskool.dto.auth;

import com.leanquitous.iskool.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private Long schoolId;

    public static AuthResponse from(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .schoolId(user.getSchoolId())
                .build();
    }
}
