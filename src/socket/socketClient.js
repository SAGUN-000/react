 
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


const socketClient = new Client({

    webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,


    onConnect: () => {

        console.log("WebSocket connected");

    },


    onDisconnect: () => {

        console.log("WebSocket disconnected");

    },


    onStompError: (frame) => {

        console.error(
            "STOMP error:",
            frame
        );

    }

});


/*
 * ==========================================
 * CONNECT
 * ==========================================
 */

const connect = () => {

    /*
     * Already connected
     */

    if (socketClient.connected) {

        return Promise.resolve();

    }


    return new Promise((resolve, reject) => {

        const previousOnConnect =
            socketClient.onConnect;

        const previousOnStompError =
            socketClient.onStompError;


        socketClient.onConnect = (frame) => {

            previousOnConnect?.(frame);

            /*
             * Restore handlers after connection.
             */

            socketClient.onConnect =
                previousOnConnect;

            socketClient.onStompError =
                previousOnStompError;

            resolve();

        };


        socketClient.onStompError = (frame) => {

            previousOnStompError?.(frame);

            socketClient.onConnect =
                previousOnConnect;

            socketClient.onStompError =
                previousOnStompError;

            reject(
                new Error(
                    frame.headers?.message ||
                    "STOMP connection failed"
                )
            );

        };


        socketClient.activate();

    });

};


/*
 * ==========================================
 * DISCONNECT
 * ==========================================
 */

const disconnect = () => {

    socketClient.deactivate();

};


/*
 * ==========================================
 * SEND MESSAGE
 * ==========================================
 */

const sendMessage = (
    receiverId,
    content
) => {

    if (!socketClient.connected) {

        throw new Error(
            "WebSocket is not connected"
        );

    }


    socketClient.publish({

        destination: "/app/message",

        body: JSON.stringify({
            receiverId,
            content
        })

    });

};


/*
 * ==========================================
 * SUBSCRIBE TO MESSAGES
 * ==========================================
 */

const subscribeToMessages = (callback) => {

    if (!socketClient.connected) {

        throw new Error(
            "There is no underlying STOMP connection"
        );

    }


    return socketClient.subscribe(
        "/topic/messages",
        (message) => {

            const receivedMessage =
                JSON.parse(message.body);

            callback(receivedMessage);

        }
    );

};


export {
    connect,
    disconnect,
    sendMessage,
    subscribeToMessages
};
 