const express = require('express');

const router = express.Router();
const fs = require('fs-extra');
const fg = require('fast-glob');
const path = require('path');
const { uploadImage } = require('../services/multer');

router.get('/upload-image', async (req, res) => {
  const images = await fg(
    path.posix.join(__dirname, '../../yolo/upload/*.{jpg,png,jpeg}'),
  );

  const hasImage = !!images;
  return res.render('upload-image', {
    hasImage,
  });
});

const EXT_ACCEPT = ['.png', '.jpeg', '.jpg'];

router.post(
  '/upload-image',
  uploadImage.array('data-image'),
  async (req, res) => {
    if (!req.files) {
      return res.render('upload-image', {
        notFile: true,
      });
    }

    // REVIEW: Might remove these lines because multer has already checked the
    // file extension
    const notSupport = req.files.some((file) => {
      return !EXT_ACCEPT.includes(
        path.extname(file.originalname).toLowerCase(),
      );
    });

    if (notSupport) {
      return res.render('upload-image', {
        notSupport,
      });
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

    return res.render('upload-image', {
      hasImage: true,
    });
  },
);

module.exports = router;
