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
            '../../../shared/assets/upload/',
            idFolder,
            file.originalname
          ),
          {
            overwrite: true,
          }
        );
      })
    );

    // NOTE: Set timeout 3s for waiting YOLO server to detect images
    socket.timeout(3000).emit('detect', { idFolder }, async (err) => {
      if (err) {
        // NOTE: If YOLO server is not running, cleanup upload folder
        await fs.remove(
          path.join(__dirname, '../../../shared/assets/upload/', idFolder)
        );

        // YOLO server is down

        return next(
          createError(503, 'Service is unavailable. Please try again later')
        );
      }

      // NOTE: Return here otherwise it will return before timeout. We can
      // check ACK to response to client
      return res.status(204).send('');
    });
  }
);

router.get('/result/:idFolder', async (req, res, next) => {
  const { idFolder } = req.params;

  try {
    const files = await fs.readdir(
      path.join(__dirname, '../../../shared/assets/result/', idFolder)
    );

    const filesResponse = files.map((fileName) => {
      const idFile = uuidv4();

      const ext = path.extname(fileName);

      // Rename file
      fs.move(
        path.join(
          __dirname,
          '../../../shared/assets/result/',
          idFolder,
          fileName
        ),
        path.join(
          __dirname,
          '../../../shared/assets/result/',
          idFolder,
          idFile + ext
        ),
        {
          overwrite: true,
        }
      );

      return {
        name: fileName,
        url: `api/result/${idFolder}/${idFile + ext}`,
      };
    });

    res.status(200).send(filesResponse);
  } catch (err) {
    return next(createError(404));
  }
});

router.get('/result/:idFolder/:fileName', async (req, res, next) => {
  const { idFolder, fileName } = req.params;

  const opts = {
    root: path.join(__dirname, '../../../shared/assets/result/', idFolder),
  };

  if (fileName.includes('.zip')) {
    try {
      await zipFolderSync(
        path.join(
          __dirname,
          '../../../shared/assets/result/',
          idFolder,
          `${idFolder}.zip`
        ),
        path.join(__dirname, '../../../shared/assets/result/', idFolder)
      );

      // NOTE: We can emit an event to notify the client to fetch zip file. Might
      // refactor this later
      // await zipFolderStream(
      //   path.join(__dirname, '../../yolo/result/', idFolder, `${idFolder}.zip`),
      //   path.join(__dirname, '../../yolo/result/', idFolder),
      // );
    } catch (err) {
      return next(createError(500));
    }
  }

  res.status(200).sendFile(fileName, opts);
});

module.exports = router;
