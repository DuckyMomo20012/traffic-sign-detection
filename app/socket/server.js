const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connect', (socket) => {
  console.log('Connected with 1 client');
  console.log(socket.id);
});

exports.io = io;
