package com.demeter.backend.audit.controller;

import com.demeter.backend.audit.model.AuditLog;
import com.demeter.backend.audit.repo.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    @Autowired
    private AuditLogRepository auditRepo;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditRepo.findAll());
    }
}