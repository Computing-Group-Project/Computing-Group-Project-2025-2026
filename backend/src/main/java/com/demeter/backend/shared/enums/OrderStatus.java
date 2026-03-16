package com.demeter.backend.shared.enums;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

public enum OrderStatus {
    PLACED,
    CONFIRMED,
    PREPARING,
    READY,
    COMPLETED,
    CANCELLED;

    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = new EnumMap<>(OrderStatus.class);

    static {
        VALID_TRANSITIONS.put(PLACED, Set.of(CONFIRMED, CANCELLED));
        VALID_TRANSITIONS.put(CONFIRMED, Set.of(PREPARING, CANCELLED));
        VALID_TRANSITIONS.put(PREPARING, Set.of(READY));
        VALID_TRANSITIONS.put(READY, Set.of(COMPLETED));
        VALID_TRANSITIONS.put(COMPLETED, Set.of());
        VALID_TRANSITIONS.put(CANCELLED, Set.of());
    }

    public static boolean isValidTransition(OrderStatus from, OrderStatus to) {
        return VALID_TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }
}
