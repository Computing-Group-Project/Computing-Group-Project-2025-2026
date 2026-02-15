package com.demeter.backend.ws;

import java.time.LocalDateTime;

public class NotificationMessage {

    private String type;     // TEST, ORDER_STATUS, NEW_ORDER
    private String title;    // short title
    private String message;  // main text
    private String orderId;  // optional
    private String status;   // optional
    private LocalDateTime time = LocalDateTime.now();

    public NotificationMessage() {}

    public NotificationMessage(String type, String title, String message, String orderId, String status) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.orderId = orderId;
        this.status = status;
        this.time = LocalDateTime.now();
    }

    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public LocalDateTime getTime() { return time; }

    public void setType(String type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public void setStatus(String status) { this.status = status; }
    public void setTime(LocalDateTime time) { this.time = time; }
}
