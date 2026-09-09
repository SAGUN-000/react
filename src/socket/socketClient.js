import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,

    onConnect: () => {
        console.log("WebSocket connected");
    },

    onDisconnect: () => {
        console.log("WebSocket disconnected");
    },

    onStompError: (frame) => {
        console.error("STOMP error:", frame);
    }
});

const connect = () => {
    socketClient.activate();
};

const disconnect = () => {
    socketClient.deactivate();
};

const sendMessage = (receiverId,content) => {
    socketClient.publish({
        destination: "/app/message",
        body: JSON.stringify({
            receiverId,
            content
        })
    });
};

const subscribeToMessages = (callback) => {
    return socketClient.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        callback(receivedMessage);
    });
};

export {
    connect,
    disconnect,
    sendMessage,
    subscribeToMessages
};