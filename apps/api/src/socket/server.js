import path from 'path';
import fs from 'fs-extra';
import { Server } from 'socket.io';
import { RESULT_DIR } from '../constants/constants.js';

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

export { io };
