import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false, // to only connect when user is authenticated
  withCredentials: true,
  transports: ["websocket"]
});

export default socket;
