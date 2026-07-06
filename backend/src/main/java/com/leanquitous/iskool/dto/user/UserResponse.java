package com.leanquitous.iskool.dto.user;

import com.leanquitous.iskool.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String mobileNumber;
    private Long schoolId;
    private Boolean isActive;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .mobileNumber(user.getMobileNumber())
                .schoolId(user.getSchoolId())
                .isActive(user.getIsActive())
                .build();
    }
}
