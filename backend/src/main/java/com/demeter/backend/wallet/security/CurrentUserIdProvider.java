package com.demeter.backend.wallet.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CurrentUserIdProvider {

    public Long getUserIdOrThrow() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("Unauthenticated request");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Long l) return l;
        if (principal instanceof Integer i) return i.longValue();
        if (principal instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }

        Object details = auth.getDetails();
        if (details instanceof Map<?, ?> map) {
            Object userId = map.get("userId");
            if (userId instanceof Number n) return n.longValue();
            if (userId instanceof String s) return Long.parseLong(s);
        }

        throw new IllegalStateException("Cannot resolve userId from JWT Authentication principal/details");
    }
}
