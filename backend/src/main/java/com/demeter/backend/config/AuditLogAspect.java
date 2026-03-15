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

        if (args.length > 1) {
            oldValue = objectMapper.writeValueAsString(args[1]);
        }

        Object result;
        String status = "SUCCESS";

        try {
            result = joinPoint.proceed();

            String newValue = objectMapper.writeValueAsString(result);

            Long userId = extractUserId(result);
            saveLog(logActivity, oldValue, newValue, status, userId);
            return result;

        } catch (Exception e) {
            status = "FAILURE";
            Long userId = extractUserId(null);
            saveLog(logActivity, oldValue, "N/A", status, userId);
            throw e;
        }
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