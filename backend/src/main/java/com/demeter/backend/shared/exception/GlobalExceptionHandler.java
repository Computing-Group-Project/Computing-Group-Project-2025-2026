package com.demeter.backend.shared.exception;

import com.demeter.backend.ai.exception.AIServiceException;
import com.demeter.backend.ai.exception.AIServiceUnavailableException;
import com.demeter.backend.shared.dto.response.ErrorResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        ErrorCode code = ex.getErrorCode();

        ErrorResponse response = new ErrorResponse(
                code.name(),
                code.getMessage(),
                code.getStatus().value()
        );

        return new ResponseEntity<>(response, code.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Validation failed");

        ErrorResponse response = new ErrorResponse(
                ErrorCode.VALIDATION_FAILED.name(),
                message,
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        ErrorResponse response = new ErrorResponse(
                ErrorCode.BAD_REQUEST.name(),
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleConflict(IllegalStateException ex) {
        ErrorResponse response = new ErrorResponse(
                "CONFLICT",
                ex.getMessage(),
                HttpStatus.CONFLICT.value()
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AIServiceUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleAIUnavailable(AIServiceUnavailableException ex) {
        ErrorResponse response = new ErrorResponse(
                "AI_SERVICE_UNAVAILABLE",
                "AI service is temporarily unavailable. Please try again later.",
                HttpStatus.SERVICE_UNAVAILABLE.value()
        );
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(AIServiceException.class)
    public ResponseEntity<ErrorResponse> handleAIServiceError(AIServiceException ex) {
        ErrorResponse response = new ErrorResponse(
                "AI_SERVICE_ERROR",
                "AI service error: " + ex.getMessage(),
                HttpStatus.BAD_GATEWAY.value()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse response = new ErrorResponse(
                ErrorCode.UNAUTHORIZED_ACCESS.name(),
                ErrorCode.UNAUTHORIZED_ACCESS.getMessage(),
                HttpStatus.FORBIDDEN.value()
        );
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorCode code = ErrorCode.INTERNAL_ERROR;

        ErrorResponse response = new ErrorResponse(
                code.name(),
                code.getMessage(),
                code.getStatus().value()
        );

        return new ResponseEntity<>(response, code.getStatus());
    }
}
