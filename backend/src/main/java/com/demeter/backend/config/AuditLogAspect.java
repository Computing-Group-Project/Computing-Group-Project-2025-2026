package com.demeter.backend.config;

import com.demeter.backend.audit.model.AuditLog;
import com.demeter.backend.audit.repo.AuditLogRepository;
import com.demeter.backend.shared.util.LogActivity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLogAspect {

    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Around("@annotation(logActivity)")
    public Object logExecution(ProceedingJoinPoint joinPoint, LogActivity logActivity) throws Throwable {

        Object[] args = joinPoint.getArgs();
        String oldValue = "N/A";

        if (args.length > 1) {
            oldValue = objectMapper.writeValueAsString(args[1]); // Deep Log: Capture input data
        }

        Object result;
        String status = "SUCCESS";
        String errorMsg = null;

        try {
            result = joinPoint.proceed();

            String newValue = objectMapper.writeValueAsString(result);

            saveLog(logActivity, oldValue, newValue, status, null);
            return result;

        } catch (Exception e) {
            status = "FAILURE";
            saveLog(logActivity, oldValue, "N/A", status, e.getMessage());
            throw e;
        }
    }

    private void saveLog(LogActivity log, String oldVal, String newVal, String status, String error) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(log.action());
        auditLog.setTargetTable(log.targetTable());
        auditLog.setOldValue(oldVal);
        auditLog.setNewValue(newVal);
        auditLog.setStatus(status);
        auditLog.setCreatedAt(java.time.LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }
}