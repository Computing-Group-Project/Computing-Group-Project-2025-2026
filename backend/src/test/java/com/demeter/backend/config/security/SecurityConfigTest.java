package com.demeter.backend.config.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void authEndpoints_shouldBeAccessibleWithoutToken() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test_student\",\"password\":\"password123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isUnauthorized()); // user not found, but endpoint is accessible (not 403)
    }

    @Test
    void protectedEndpoints_shouldReturn403WithoutToken() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    void protectedEndpoints_shouldReturn403WithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/orders")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void authRegister_shouldRejectBlankUsername() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"secure123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authRegister_shouldRejectBlankPassword() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test_student\",\"password\":\"\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authRegister_shouldRejectInvalidRole() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test_student\",\"password\":\"secure123\",\"role\":\"HACKER\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authRegister_shouldRejectWeakPassword() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test_student\",\"password\":\"short\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isBadRequest());
    }
}
