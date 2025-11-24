import { Client } from "@stomp/stompjs";
import { WS_CLIENT_URL } from "./Api";
import SockJS from "sockjs-client";

const subscriptions = []; // ← almacena todas las suscripciones pendientes

const stompClient = new Client({
  // brokerURL: `${WS_CLIENT_URL}/chats`,
  webSocketFactory: () => new SockJS(`${WS_CLIENT_URL}/chats`),
  reconnectDelay: 5000,

  onConnect: () => {
    console.log("🔌 STOMP conectado");

    // Re-suscribir TODAS las rutas registradas
    subscriptions.forEach(({ destination, callback }) => {
      stompClient.subscribe(destination, callback);
    });
  },
});

// Conectar una sola vez
export const connect = () => {
  if (!stompClient.active) {
    stompClient.activate();
  }
};

// Registrar suscripción (aunque no esté conectado aún)
export const subscribe = (destination, callback) => {
  // Guardar suscripción si no está registrada aún
  if (!subscriptions.find(sub => sub.destination === destination)) {
    subscriptions.push({ destination, callback });
  }

  // Si ya está conectado, suscribir inmediatamente
  if (stompClient.connected) {
    stompClient.subscribe(destination, callback);
  }
};

export const sendMessage = (destination, body) => {
  if (stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn("⚠️ No conectado a STOMP aún");
  }
};

export default stompClient;
