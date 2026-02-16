package com.demeter.backend.shared.enums;

public enum DiscountType {
    PERCENTAGE,      // Discount as a percentage (e.g., 20%)
    FIXED_AMOUNT;    // Discount as a fixed amount (e.g., $5)

    public String getDisplayName() {
        return switch (this) {
            case PERCENTAGE -> "Percentage Discount";
            case FIXED_AMOUNT -> "Fixed Amount Discount";
        };
    }
}
