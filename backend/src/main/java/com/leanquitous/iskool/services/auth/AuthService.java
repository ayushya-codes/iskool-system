package com.leanquitous.iskool.services.auth;

import com.leanquitous.iskool.config.JwtUtil;
import com.leanquitous.iskool.dto.auth.AuthResponse;
import com.leanquitous.iskool.dto.auth.LoginRequest;
import com.leanquitous.iskool.dto.auth.RegisterRequest;
import com.leanquitous.iskool.entity.user.User;
import com.leanquitous.iskool.repositories.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        User user = resolveUser(request);
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getSchoolId());
        return AuthResponse.from(user, token);
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getSchoolId() == null && request.getRole() != User.Role.SUPER_ADMIN) {
            throw new RuntimeException("School ID is required for non-super-admin users");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = request.toEntity(passwordHash);
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getSchoolId());
        return AuthResponse.from(user, token);
    }

    public AuthResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return AuthResponse.from(user, null);
    }

    private User resolveUser(LoginRequest request) {
        if (request.getSchoolId() != null) {
            return userRepository.findByEmailAndSchoolId(request.getEmail(), request.getSchoolId())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        }
        return userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
