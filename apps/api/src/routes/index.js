import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import fs from 'fs-extra';
import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { RESULT_DIR, UPLOAD_DIR } from '../constants/constants.js';
import { uploadImage } from '../services/multer.js';
import { socket } from '../socket/client.js';
import { zipFolderSync } from '../utils/zip.js';

const router = Router();

router.post(
  '/run-model',
  uploadImage.array('data-image'),
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    if (req.files.length === 0) {
      return next(createError(422, 'No file uploaded'));
    }

    const idFolder = uuidv4();

    await Promise.all(
      req.files.map(async (file) => {
        await fs.move(
          fileURLToPath(
            new URL(`../public/img/${file.originalname}`, import.meta.url),
          ),
          path.join(UPLOAD_DIR, idFolder, file.originalname),
          {
            overwrite: true,
          },
        );
      }),
    );

    // NOTE: Set timeout 3s for waiting YOLO server to detect images
    socket.timeout(3000).emit('detect', { idFolder }, async (err) => {
      if (err) {
        // NOTE: If YOLO server is not running, cleanup upload folder
        await fs.remove(path.join(UPLOAD_DIR, idFolder));

        // YOLO server is down

        return next(
          createError(503, 'Service is unavailable. Please try again later'),
        );
      }

      // NOTE: Return here otherwise it will return before timeout. We can
      // check ACK to response to client
      return res.status(204).send('');
    });
  },
);

// eslint-disable-next-line consistent-return
router.get('/result/:idFolder', async (req, res, next) => {
  const { idFolder } = req.params;

  try {
    const files = await fs.readdir(path.join(RESULT_DIR, idFolder));

    const filesResponse = files.map((fileName) => {
      const idFile = uuidv4();

      const ext = path.extname(fileName);

      // Rename file
      fs.move(
        path.join(RESULT_DIR, idFolder, fileName),
        path.join(RESULT_DIR, idFolder, idFile + ext),
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
  } catch (err) {
    return next(createError(404));
  }
});

// eslint-disable-next-line consistent-return
router.get('/result/:idFolder/:fileName', async (req, res, next) => {
  const { idFolder, fileName } = req.params;

  const opts = {
    root: path.join(RESULT_DIR, idFolder),
  };

  if (fileName.includes('.zip')) {
    try {
      await zipFolderSync(
        path.join(RESULT_DIR, idFolder, `${idFolder}.zip`),
        path.join(RESULT_DIR, idFolder),
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

export default router;
