package com.demeter.backend.shared.enums;

public enum PromotionStatus {
    ACTIVE,     // Promotion is currently active
    INACTIVE,   // Promotion is inactive
    EXPIRED;    // Promotion has expired

    public String getDisplayName() {
        return switch (this) {
            case ACTIVE -> "Active";
            case INACTIVE -> "Inactive";
            case EXPIRED -> "Expired";
        };
    }
}
