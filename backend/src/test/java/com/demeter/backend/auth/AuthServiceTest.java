package com.demeter.backend.auth;

import com.demeter.backend.auth.service.AuthService;
import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtUtil);
    }

    // ── Registration Tests ──

    @Test
    void register_withValidUser_shouldEncodePasswordAndSave() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword("secure123");
        user.setRole("STUDENT");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        User result = authService.register(user);

        assertNotNull(result.getId());
        assertTrue(passwordEncoder.matches("secure123", result.getPassword()));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_withWeakPassword_tooShort_shouldThrow() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword("abc1");
        user.setRole("STUDENT");

        AppException ex = assertThrows(AppException.class, () -> authService.register(user));
        assertEquals(ErrorCode.WEAK_PASSWORD, ex.getErrorCode());
    }

    @Test
    void register_withWeakPassword_noDigits_shouldThrow() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword("abcdefgh");
        user.setRole("STUDENT");

        AppException ex = assertThrows(AppException.class, () -> authService.register(user));
        assertEquals(ErrorCode.WEAK_PASSWORD, ex.getErrorCode());
    }

    @Test
    void register_withWeakPassword_noLetters_shouldThrow() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword("12345678");
        user.setRole("STUDENT");

        AppException ex = assertThrows(AppException.class, () -> authService.register(user));
        assertEquals(ErrorCode.WEAK_PASSWORD, ex.getErrorCode());
    }

    @Test
    void register_withNullPassword_shouldThrow() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword(null);
        user.setRole("STUDENT");

        AppException ex = assertThrows(AppException.class, () -> authService.register(user));
        assertEquals(ErrorCode.WEAK_PASSWORD, ex.getErrorCode());
    }

    // ── Login Tests ──

    @Test
    void login_withValidCredentials_shouldReturnToken() {
        User user = new User();
        user.setId(1L);
        user.setUsername("test_student");
        user.setPassword(passwordEncoder.encode("secure123"));
        user.setRole("STUDENT");

        when(userRepository.findByUsername("test_student")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("test_student", "STUDENT", 1L)).thenReturn("mock-jwt-token");

        String token = authService.login("test_student", "secure123");

        assertEquals("mock-jwt-token", token);
        verify(jwtUtil).generateToken("test_student", "STUDENT", 1L);
    }

    @Test
    void login_withNonExistentUsername_shouldThrow() {
        when(userRepository.findByUsername("unknown_user")).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class,
                () -> authService.login("unknown_user", "password1"));
        assertEquals(ErrorCode.INVALID_CREDENTIALS, ex.getErrorCode());
    }

    @Test
    void login_withWrongPassword_shouldThrow() {
        User user = new User();
        user.setUsername("test_student");
        user.setPassword(passwordEncoder.encode("correct123"));

        when(userRepository.findByUsername("test_student")).thenReturn(Optional.of(user));

        AppException ex = assertThrows(AppException.class,
                () -> authService.login("test_student", "wrongpass1"));
        assertEquals(ErrorCode.INVALID_CREDENTIALS, ex.getErrorCode());
    }
}
