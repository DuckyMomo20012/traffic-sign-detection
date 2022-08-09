const express = require('express');

const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { uploadImage } = require('../services/multer');

router.get('/upload-image', async (req, res) => {
  const hasImage = await fs.pathExists(
    path.join(__dirname, '../public/img/image.png'),
  );
  return res.render('upload-image', {
    hasImage,
  });
});

const EXT_ACCEPT = ['.png', '.jpeg', '.jpg'];

router.post(
  '/upload-image',
  uploadImage.single('data-image'),
  async (req, res) => {
    if (!req.file) {
      return res.render('upload-image', {
        notFile: true,
      });
    }

    const extname = path.extname(req.file.originalname).toLowerCase();

    if (!EXT_ACCEPT.includes(extname)) {
      return res.render('upload-image', {
        notSupport: true,
      });
    }

    await fs.move(
      path.join(__dirname, '../public/img/', req.file.originalname),
      path.join(__dirname, '../public/img/', 'image.png'),
      {
        overwrite: true,
      },
    );

    await fs.move(
      path.join(__dirname, '../public/img/image.png'),
      path.join(__dirname, '../../yolo/image.png'),
      {
        overwrite: true,
      },
    );

    return res.render('upload-image', {
      hasImage: true,
    });
  },
);

module.exports = router;
