package com.demeter.backend.shared.dto.response;
import java.time.LocalDateTime;

public class ErrorResponse {
    private String errorCode;
    private String message;
    private int status;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(String errorCode, String message, int status) {
        this.errorCode = errorCode;
        this.message = message;
        this.status = status;
    }

    public String getErrorCode() { return errorCode; }
    public String getMessage() { return message; }
    public int getStatus() { return status; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
