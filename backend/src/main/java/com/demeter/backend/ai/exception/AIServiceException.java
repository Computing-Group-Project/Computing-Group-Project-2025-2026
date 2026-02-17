// AIServiceException.java
package com.demeter.ai.exception;

public class AIServiceException extends RuntimeException {
    private final String serviceName;
    private final int statusCode;

    public AIServiceException(String message, Throwable cause, String serviceName, int statusCode) {
        super(message, cause);
        this.serviceName = serviceName;
        this.statusCode = statusCode;
    }

    public String getServiceName() { return serviceName; }
    public int getStatusCode() { return statusCode; }
}