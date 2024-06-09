import socketURL from "./utils/socketURL.mjs";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

const useSocket = () => {
    if (!socketInstance) {
        socketInstance = io(socketURL, {
            transports: ["websocket", "polling"],
            auth: {
                token: process.env.NEXT_PUBLIC_SOCKET_SERVER_SECRET,
            },
        });
    }

    return socketInstance;
};

export default useSocket;
