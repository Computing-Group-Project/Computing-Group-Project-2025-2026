package com.demeter.backend.ws;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate template;

    public NotificationService(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendToStaff(NotificationMessage msg) {
        template.convertAndSend("/topic/staff", msg);
    }

    public void sendToAdmin(NotificationMessage msg) {
        template.convertAndSend("/topic/admin", msg);
    }

    public void sendOrderUpdate(NotificationMessage msg) {
        template.convertAndSend("/topic/orders", msg);
    }

    // Send to specific user
    public void sendToUser(String username, NotificationMessage msg) {
        template.convertAndSendToUser(username, "/queue/notifications", msg);
    }
}
