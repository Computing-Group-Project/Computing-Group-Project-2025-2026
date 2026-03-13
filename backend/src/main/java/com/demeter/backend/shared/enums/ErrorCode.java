package com.demeter.backend.shared.enums;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    MENU_NOT_FOUND("Menu item not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND("Category not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("User not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS("Invalid email or password", HttpStatus.UNAUTHORIZED),
    WEAK_PASSWORD("Password must be at least 8 characters with a mix of letters and numbers", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS("You are not authorized to access this resource", HttpStatus.FORBIDDEN),
    BAD_REQUEST("Invalid request", HttpStatus.BAD_REQUEST),
    VALIDATION_FAILED("Validation failed", HttpStatus.BAD_REQUEST),
    INTERNAL_ERROR("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus status;

    ErrorCode(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() { return message; }
    public HttpStatus getStatus() { return status; }
}
