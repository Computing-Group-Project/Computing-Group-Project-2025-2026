import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const MAX_RECONNECT_DELAY = 30000;

function getReconnectDelay() {
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
  return delay;
}

export function connectWebSocket(onConnected) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_WS_BASE_URL ?? "http://localhost:8080"}/ws`),
    reconnectDelay: 0, // We handle reconnection manually
    onConnect: () => {
      reconnectAttempts = 0;
      if (onConnected) onConnected(stompClient);
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
      scheduleReconnect(onConnected);
    },
    onWebSocketClose: () => {
      scheduleReconnect(onConnected);
    },
  });

  stompClient.activate();
  return stompClient;
}

function scheduleReconnect(onConnected) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error(`WebSocket: max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
    return;
  }

  const delay = getReconnectDelay();
  reconnectAttempts++;
  console.warn(`WebSocket: reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

  setTimeout(() => {
    if (stompClient) {
      try {
        stompClient.deactivate();
      } catch {
        // ignore deactivation errors
      }
    }
    connectWebSocket(onConnected);
  }, delay);
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
  reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // Prevent reconnection after intentional disconnect
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
