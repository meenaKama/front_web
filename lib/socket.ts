import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {

  if (socket) return socket; // déjà créé

  socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("✅ Socket connecté :", socket?.id));
  socket.on("connect_error", (err) => console.error("❌ Socket erreur :", err.message));


  return socket;
};

export const getSocket = () => socket;
