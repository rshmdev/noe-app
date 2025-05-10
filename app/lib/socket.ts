// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io('https://noe-api-yv4w.onrender.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default socket;
