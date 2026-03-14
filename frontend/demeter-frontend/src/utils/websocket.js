import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectWebSocket(onConnected) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: () => {
      if (onConnected) onConnected(stompClient);
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function subscribe(client, destination, callback) {
  if (client && client.connected) {
    return client.subscribe(destination, (message) => {
      const body = JSON.parse(message.body);
      callback(body);
    });
  }
  return null;
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
