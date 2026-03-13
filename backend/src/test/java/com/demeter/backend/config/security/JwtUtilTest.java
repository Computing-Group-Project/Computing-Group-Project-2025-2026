package com.demeter.backend.config.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil("test-secret-key-for-unit-tests-minimum-32-chars-long", 3600000);
    }

    @Test
    void generateToken_shouldReturnNonNullToken() {
        String token = jwtUtil.generateToken("test_student", "STUDENT");

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractUsername_shouldReturnCorrectUsername() {
        String token = jwtUtil.generateToken("test_student", "STUDENT");

        String username = jwtUtil.extractUsername(token);

        assertEquals("test_student", username);
    }

    @Test
    void extractRole_shouldReturnCorrectRole() {
        String token = jwtUtil.generateToken("test_student", "ADMIN");

        String role = jwtUtil.extractRole(token);

        assertEquals("ADMIN", role);
    }

    @Test
    void extractUsername_withDifferentRoles_shouldWork() {
        String studentToken = jwtUtil.generateToken("student_user", "STUDENT");
        String staffToken = jwtUtil.generateToken("staff_user", "STAFF");
        String adminToken = jwtUtil.generateToken("admin_user", "ADMIN");

        assertEquals("student_user", jwtUtil.extractUsername(studentToken));
        assertEquals("staff_user", jwtUtil.extractUsername(staffToken));
        assertEquals("admin_user", jwtUtil.extractUsername(adminToken));

        assertEquals("STUDENT", jwtUtil.extractRole(studentToken));
        assertEquals("STAFF", jwtUtil.extractRole(staffToken));
        assertEquals("ADMIN", jwtUtil.extractRole(adminToken));
    }

    @Test
    void extractUsername_withInvalidToken_shouldThrow() {
        assertThrows(Exception.class, () -> jwtUtil.extractUsername("invalid.token.here"));
    }

    @Test
    void extractUsername_withExpiredToken_shouldThrow() {
        JwtUtil shortLivedJwt = new JwtUtil(
                "test-secret-key-for-unit-tests-minimum-32-chars-long", 0);
        String token = shortLivedJwt.generateToken("test_student", "STUDENT");

        assertThrows(Exception.class, () -> jwtUtil.extractUsername(token));
    }
}
