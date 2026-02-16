package com.demeter.backend.ws;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ws-test")
public class WsTestController {

    private final NotificationService notificationService;

    public WsTestController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/staff")
    public String testStaff(@RequestParam String msg) {
        notificationService.sendToStaff(
                new NotificationMessage("TEST", "Staff Notification", msg, null, null)
        );
        return "Sent to /topic/staff";
    }

    @PostMapping("/admin")
    public String testAdmin(@RequestParam String msg) {
        notificationService.sendToAdmin(
                new NotificationMessage("TEST", "Admin Notification", msg, null, null)
        );
        return "Sent to /topic/admin";
    }

    @PostMapping("/orders")
    public String testOrders(@RequestParam String orderId, @RequestParam String status) {
        notificationService.sendOrderUpdate(
                new NotificationMessage("ORDER_STATUS", "Order Update",
                        "Order " + orderId + " is now " + status,
                        orderId, status)
        );
        return "Sent to /topic/orders";
    }
}
