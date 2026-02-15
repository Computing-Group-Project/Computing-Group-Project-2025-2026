package com.demeter.backend.shared.exception;

import com.demeter.backend.shared.dto.response.ErrorResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import org.springframework.http.ResponseEntity;
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
