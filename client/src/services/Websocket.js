import { Client } from "@stomp/stompjs";
import { WS_CLIENT_URL } from "./Api";

const stompClient = new Client({
  brokerURL: `${WS_CLIENT_URL}/chats`, 
  reconnectDelay: 5000,                    
});

export const connect = () => {
  if (!stompClient.active && !stompClient.connected) {
    stompClient.activate();
  }
};


export const subscribe = (destination, callback) => {
  if (!stompClient.connected) {
    stompClient.onConnect = () => {
      stompClient.subscribe(destination, callback);
    };
  } else {
    stompClient.subscribe(destination, callback);
  }
};

export const sendMessage = (destination, body) => {
  if (stompClient.connected) {
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn("⚠️ STOMP no está conectado aún");
  }
};

export default stompClient;
