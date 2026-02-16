package com.demeter.backend.ws;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Clients SUBSCRIBE to these
        config.enableSimpleBroker("/topic", "/queue");

        // Clients SEND messages to /app/...
        config.setApplicationDestinationPrefixes("/app");

        // For user-specific messaging: /user/queue/...
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket handshake endpoint
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // dev only
                .withSockJS();
    }
}
