package com.demeter.backend.shared.enums;

public enum DiscountType {
    PERCENTAGE,          // Discount as a percentage (e.g., 20%)
    FIXED_AMOUNT,        // Discount as a fixed amount (e.g., 5 GK)
    BOGO,                // Buy one get one free
    BUY_X_GET_Y,         // Buy X get Y free (AI service alias for BOGO)
    COMBO_FIXED_PRICE,   // Fixed price for a combo of items
    COMBO;               // Combo deal (AI service alias for COMBO_FIXED_PRICE)

    public String getDisplayName() {
        return switch (this) {
            case PERCENTAGE -> "Percentage Discount";
            case FIXED_AMOUNT -> "Fixed Amount Discount";
            case BOGO, BUY_X_GET_Y -> "Buy One Get One Free";
            case COMBO_FIXED_PRICE, COMBO -> "Combo Fixed Price";
        };
    }
}
