const { io } = require('socket.io-client');
const { io: socketServer } = require('./server.js');

const socket = io.connect('http://127.0.0.1:1234');

socket.on('connect', () => {
  console.log('Connected with YOLO server');
  console.log(socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from YOLO server');
  console.log(socket.id); // undefined
});

socket.on('detect-finished', (data) => {
  socketServer.emit('detect-finished', data);
});

socket.on('detect-status', (data) => {
  socketServer.emit('detect-status', data);
});

exports.socket = socket;
