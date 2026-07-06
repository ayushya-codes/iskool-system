package com.leanquitous.iskool.services.user;

import com.leanquitous.iskool.dto.user.CreateUserRequest;
import com.leanquitous.iskool.dto.user.UserResponse;
import com.leanquitous.iskool.entity.user.User;
import com.leanquitous.iskool.repositories.user.UserRepository;
import com.leanquitous.iskool.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> findAll() {
        Long schoolId = TenantContext.getCurrentTenant();
        if (schoolId != null) {
            return userRepository.findBySchoolId(schoolId).stream()
                    .map(UserResponse::from)
                    .toList();
        }
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse create(CreateUserRequest request) {
        Long schoolId = TenantContext.getCurrentTenant();
        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = request.toEntity(passwordHash, schoolId);
        user = userRepository.save(user);
        return UserResponse.from(user);
    }
}
