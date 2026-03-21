package com.demeter.backend.ai.exception;

public class AIServiceUnavailableException extends AIServiceException {
    public AIServiceUnavailableException(String message, Throwable cause, String serviceName) {
        super(message, cause, serviceName, 503);
    }
}