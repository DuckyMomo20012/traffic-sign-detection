const { Server } = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const { RESULT_DIR } = require('../constants/constants');

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connect', (socket) => {
  console.log('Connected with 1 client');
  console.log(socket.id);

  socket.on('delete-folder', async (data) => {
    const { idFolder } = data;

    await fs.remove(path.join(RESULT_DIR, idFolder));
  });
});

exports.io = io;
