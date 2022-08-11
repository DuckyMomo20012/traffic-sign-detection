const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { socket } = require('../socket/socket.js');
const { uploadImage } = require('../services/multer');

router.post('/run-model', uploadImage.array('data-image'), async (req, res) => {
  if (!req.files) {
    return createError(422, 'No file uploaded');
  }

  await Promise.all(
    req.files.map(async (file) => {
      await fs.move(
        path.join(__dirname, '../public/img/', file.originalname),
        path.join(__dirname, '../../yolo/upload/', file.originalname),
        {
          overwrite: true,
        },
      );
    }),
  );

  socket.emit('detect', 'Please detect for me');

  return res.status(204).send('');
});

module.exports = router;
