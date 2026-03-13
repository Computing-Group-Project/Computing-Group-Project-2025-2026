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
        String token = jwtUtil.generateToken("test@bastion.edu", "STUDENT");

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String token = jwtUtil.generateToken("test@bastion.edu", "STUDENT");

        String email = jwtUtil.extractEmail(token);

        assertEquals("test@bastion.edu", email);
    }

    @Test
    void extractRole_shouldReturnCorrectRole() {
        String token = jwtUtil.generateToken("test@bastion.edu", "ADMIN");

        String role = jwtUtil.extractRole(token);

        assertEquals("ADMIN", role);
    }

    @Test
    void extractEmail_withDifferentRoles_shouldWork() {
        String studentToken = jwtUtil.generateToken("student@bastion.edu", "STUDENT");
        String staffToken = jwtUtil.generateToken("staff@bastion.edu", "STAFF");
        String adminToken = jwtUtil.generateToken("admin@bastion.edu", "ADMIN");

        assertEquals("student@bastion.edu", jwtUtil.extractEmail(studentToken));
        assertEquals("staff@bastion.edu", jwtUtil.extractEmail(staffToken));
        assertEquals("admin@bastion.edu", jwtUtil.extractEmail(adminToken));

        assertEquals("STUDENT", jwtUtil.extractRole(studentToken));
        assertEquals("STAFF", jwtUtil.extractRole(staffToken));
        assertEquals("ADMIN", jwtUtil.extractRole(adminToken));
    }

    @Test
    void extractEmail_withInvalidToken_shouldThrow() {
        assertThrows(Exception.class, () -> jwtUtil.extractEmail("invalid.token.here"));
    }

    @Test
    void extractEmail_withExpiredToken_shouldThrow() {
        JwtUtil shortLivedJwt = new JwtUtil(
                "test-secret-key-for-unit-tests-minimum-32-chars-long", 0);
        String token = shortLivedJwt.generateToken("test@bastion.edu", "STUDENT");

        assertThrows(Exception.class, () -> jwtUtil.extractEmail(token));
    }
}
