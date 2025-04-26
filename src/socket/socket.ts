// /socket/socket.ts
import io, {Socket} from "socket.io-client";

let socket: typeof Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001", {
      autoConnect: false, // We'll connect manually
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};