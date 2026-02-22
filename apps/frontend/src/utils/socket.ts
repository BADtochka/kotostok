import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_WS_URL;

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});
