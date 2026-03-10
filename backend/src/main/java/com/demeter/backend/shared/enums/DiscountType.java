package com.demeter.backend.shared.enums;

public enum DiscountType {
    PERCENTAGE,          // Discount as a percentage (e.g., 20%)
    FIXED_AMOUNT,        // Discount as a fixed amount (e.g., 5 GK)
    BOGO,                // Buy one get one free
    COMBO_FIXED_PRICE;   // Fixed price for a combo of items

    public String getDisplayName() {
        return switch (this) {
            case PERCENTAGE -> "Percentage Discount";
            case FIXED_AMOUNT -> "Fixed Amount Discount";
            case BOGO -> "Buy One Get One Free";
            case COMBO_FIXED_PRICE -> "Combo Fixed Price";
        };
    }
}
