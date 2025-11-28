import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (url: string): Socket => {
  console.log('🔧 RAW: getSocket called with URL:', url);
  
  if (!socket) {
    console.log('🔧 RAW: Creating new socket instance');
    socket = io(url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    // Add event handlers directly to socket for debugging
    socket.on("connect", () => {
      console.log('🔧 RAW: Socket.IO connected at root level, socket.id =', socket?.id);
    });

    socket.on("disconnect", () => {
      console.log('🔧 RAW: Socket.IO disconnected at root level');
    });

    socket.on("connect_error", (error) => {
      console.error('🔧 RAW: Socket.IO connect_error:', error);
    });

    socket.on("error", (error) => {
      console.error('🔧 RAW: Socket.IO error at root level:', error);
    });
  } else {
    console.log('🔧 RAW: Returning existing socket instance, connected =', socket.connected);
  }
  
  return socket;
};