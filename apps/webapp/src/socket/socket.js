import { io } from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:3000');

socket.on('connect', () => {
  console.log('Connected with Express server');
  console.log(socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Express server');
  console.log(socket.id); // undefined
});

export { socket };
