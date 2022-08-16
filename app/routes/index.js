const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { socket } = require('../socket/socket.js');
const { uploadImage } = require('../services/multer');

router.post('/run-model', uploadImage.array('data-image'), async (req, res) => {
  if (!req.files) {
    return createError(422, 'No file uploaded');
  }

  const idFolder = uuidv4();

  await Promise.all(
    req.files.map(async (file) => {
      await fs.move(
        path.join(__dirname, '../public/img/', file.originalname),
        path.join(__dirname, '../../yolo/upload/', idFolder, file.originalname),
        {
          overwrite: true,
        },
      );
    }),
  );

  socket.emit('detect', { idFolder });

  return res.status(204).send('');
});

router.get('/result/:idFolder', async (req, res) => {
  const { idFolder } = req.params;

  const files = await fs.readdir(
    path.join(__dirname, '../public/result/', idFolder),
  );

  const filesResponse = files.map((fileName) => {
    const idFile = uuidv4();

    const ext = path.extname(fileName);

    // Rename file
    fs.move(
      path.join(__dirname, '../public/result/', idFolder, fileName),
      path.join(__dirname, '../public/result/', idFolder, idFile + ext),
      {
        overwrite: true,
      },
    );

    return {
      name: fileName,
      url: `api/result/${idFolder}/${idFile + ext}`,
    };
  });

  res.status(200).send(filesResponse);
});

router.get('/result/:idFolder/:fileName', (req, res) => {
  const { idFolder, fileName } = req.params;

  const opts = {
    root: path.join(__dirname, '../public/result/', idFolder),
  };

  res.status(200).sendFile(fileName, opts);
});

module.exports = router;
