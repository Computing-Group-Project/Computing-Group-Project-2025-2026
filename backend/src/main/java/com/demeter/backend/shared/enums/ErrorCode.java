package com.demeter.backend.shared.enums;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    BAD_REQUEST("Invalid request", HttpStatus.BAD_REQUEST),
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
