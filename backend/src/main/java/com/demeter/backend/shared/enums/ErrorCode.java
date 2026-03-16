package com.demeter.backend.shared.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    MENU_NOT_FOUND("Menu item not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND("Category not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("User not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS("Invalid username or password", HttpStatus.UNAUTHORIZED),
    DISCOUNT_NOT_FOUND("Discount not found", HttpStatus.NOT_FOUND),
    WEAK_PASSWORD("Password must be at least 8 characters with a mix of letters and numbers", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS("You are not authorized to access this resource", HttpStatus.FORBIDDEN),
    BAD_REQUEST("Invalid request", HttpStatus.BAD_REQUEST),
    VALIDATION_FAILED("Validation failed", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_BALANCE("Insufficient Gold Krakens balance", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_FOUND("Review not found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS("Review already submitted for this order", HttpStatus.CONFLICT),
    REVIEW_WINDOW_EXPIRED("Review window has expired (1 hour after completion)", HttpStatus.BAD_REQUEST),
    CAFETERIA_NOT_FOUND("Cafeteria not found", HttpStatus.NOT_FOUND),
    RATE_LIMITED("Too many requests. Please try again later.", HttpStatus.TOO_MANY_REQUESTS),
    AI_SERVICE_UNAVAILABLE("AI service is temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    ORDER_CANNOT_BE_CANCELLED("Order can only be cancelled before staff confirmation", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_TRANSITION("Invalid order status transition", HttpStatus.BAD_REQUEST),
    INTERNAL_ERROR("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus status;

    ErrorCode(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

}
