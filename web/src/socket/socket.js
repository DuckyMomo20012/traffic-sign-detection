import { io } from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:1234');

socket.on('connect', () => {
  console.log('Connected with YOLO server');
  console.log(socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from YOLO server');
  console.log(socket.id); // undefined
});

export { socket };
