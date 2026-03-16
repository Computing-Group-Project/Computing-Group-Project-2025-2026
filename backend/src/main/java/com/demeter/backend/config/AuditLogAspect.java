package com.demeter.backend.config;

import com.demeter.backend.audit.model.AuditLog;
import com.demeter.backend.audit.repo.AuditLogRepository;
import com.demeter.backend.auth.dto.response.LoginResponseDTO;
import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.util.LogActivity;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuditLogAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditLogAspect.class);

    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private JwtUtil jwtUtil;

    @Around("@annotation(logActivity)")
    public Object logExecution(ProceedingJoinPoint joinPoint, LogActivity logActivity) throws Throwable {

        Object[] args = joinPoint.getArgs();
        String oldValue = "N/A";

        try {
            if (args.length > 1) {
                oldValue = objectMapper.writeValueAsString(args[1]);
            }
        } catch (Exception e) {
            log.warn("Audit: failed to serialize old value for {}: {}", logActivity.action(), e.getMessage());
        }

        Object result;

        try {
            result = joinPoint.proceed();
        } catch (Exception e) {
            // The main operation failed — log and re-throw
            try {
                Long userId = extractUserId(null);
                saveLog(logActivity, oldValue, "N/A", "FAILURE", userId);
            } catch (Exception logEx) {
                log.error("Audit: failed to save FAILURE log for {}: {}", logActivity.action(), logEx.getMessage());
            }
            throw e;
        }

        // Main operation succeeded — log asynchronously without risking a rollback
        try {
            String newValue = objectMapper.writeValueAsString(result);
            Long userId = extractUserId(result);
            saveLog(logActivity, oldValue, newValue, "SUCCESS", userId);
        } catch (Exception e) {
            log.error("Audit: failed to save SUCCESS log for {}: {}", logActivity.action(), e.getMessage());
        }

        return result;
    }

    private Long extractUserId(Object result) {
        // Try to get userId from JWT in current request
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    return jwtUtil.extractUserId(token);
                }
            }
        } catch (Exception e) {
            log.warn("Audit: failed to extract userId from JWT: {}", e.getMessage());
        }

        // For login: extract userId from the result (LoginResponseDTO)
        if (result instanceof LoginResponseDTO dto) {
            return dto.getUserId();
        }

        return 0L;
    }

    private String extractClientIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String forwarded = request.getHeader("X-Forwarded-For");
                if (forwarded != null && !forwarded.isBlank()) {
                    return forwarded.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.warn("Audit: failed to extract client IP: {}", e.getMessage());
        }
        return null;
    }

    private void saveLog(LogActivity logActivity, String oldVal, String newVal, String status, Long userId) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(userId);
        auditLog.setAction(logActivity.action());
        auditLog.setTargetTable(logActivity.targetTable());
        auditLog.setOldValue(oldVal);
        auditLog.setNewValue(newVal);
        auditLog.setStatus(status);
        auditLog.setIpAddress(extractClientIp());
        auditLog.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }
}