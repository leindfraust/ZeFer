const URL = process.env.NODE_ENV === 'production' ? "https://melted-patience-leindfraust.koyeb.app/" : 'http://localhost:5000';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

const useSocket = () => {
    if (!socketInstance) {
        // Replace 'http://localhost:3000' with your server URL
        socketInstance = io(URL, {
            auth: {
                token: process.env.NEXT_PUBLIC_SOCKET_SERVER_SECRET,
            },
        })
    }

    return socketInstance;
};

export default useSocket;
