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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuditLogAspect {

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
        } catch (Exception ignored) {
            // Don't let audit serialization prevent the main operation
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
                // Audit logging must never mask the original exception
            }
            throw e;
        }

        // Main operation succeeded — log asynchronously without risking a rollback
        try {
            String newValue = objectMapper.writeValueAsString(result);
            Long userId = extractUserId(result);
            saveLog(logActivity, oldValue, newValue, "SUCCESS", userId);
        } catch (Exception ignored) {
            // Audit logging failure must not affect the successful operation
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
        } catch (Exception ignored) {
        }

        // For login: extract userId from the result (LoginResponseDTO)
        if (result instanceof LoginResponseDTO dto) {
            return dto.getUserId();
        }

        return 0L;
    }

    private void saveLog(LogActivity log, String oldVal, String newVal, String status, Long userId) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUserId(userId);
        auditLog.setAction(log.action());
        auditLog.setTargetTable(log.targetTable());
        auditLog.setOldValue(oldVal);
        auditLog.setNewValue(newVal);
        auditLog.setStatus(status);
        auditLog.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }
}