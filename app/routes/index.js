const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { socket } = require('../socket/client.js');
const { uploadImage } = require('../services/multer');
const { zipFolderSync } = require('../utils/zip.js');

router.post(
  '/run-model',
  uploadImage.array('data-image'),
  async (req, res, next) => {
    if (req.files.length === 0) {
      return next(createError(422, 'No file uploaded'));
    }

    const idFolder = uuidv4();

    await Promise.all(
      req.files.map(async (file) => {
        await fs.move(
          path.join(__dirname, '../public/img/', file.originalname),
          path.join(
            __dirname,
            '../../yolo/upload/',
            idFolder,
            file.originalname,
          ),
          {
            overwrite: true,
          },
        );
      }),
    );

    // NOTE: Set timeout 3s for waiting YOLO server to detect images
    socket.timeout(3000).emit('detect', { idFolder }, (err, response) => {
      if (err) {
        return next(
          createError(408, 'Request timeout. Please try again later'),
        );
      }
      console.log(response);

      return res.status(204).send('');
    });
  },
);

router.get('/result/:idFolder', async (req, res) => {
  const { idFolder } = req.params;

  const files = await fs.readdir(
    path.join(__dirname, '../../yolo/result/', idFolder),
  );

  const filesResponse = files.map((fileName) => {
    const idFile = uuidv4();

    const ext = path.extname(fileName);

    // Rename file
    fs.move(
      path.join(__dirname, '../../yolo/result/', idFolder, fileName),
      path.join(__dirname, '../../yolo/result/', idFolder, idFile + ext),
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

router.get('/result/:idFolder/:fileName', async (req, res) => {
  const { idFolder, fileName } = req.params;

  const opts = {
    root: path.join(__dirname, '../../yolo/result/', idFolder),
  };

  if (fileName.includes('.zip')) {
    await zipFolderSync(
      path.join(__dirname, '../../yolo/result/', idFolder, `${idFolder}.zip`),
      path.join(__dirname, '../../yolo/result/', idFolder),
    );

    // NOTE: Currently we don't know when the zipping process is done, we can
    // emit an event to YOLO server, but then we have to emit that event back to
    // client. We can refactor this later
    // await zipFolderStream(
    //   path.join(__dirname, '../../yolo/result/', idFolder, `${idFolder}.zip`),
    //   path.join(__dirname, '../../yolo/result/', idFolder),
    // );
  }

  res.status(200).sendFile(fileName, opts);
});

module.exports = router;
