const express = require('express');

const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { uploadModel } = require('../services/multer');

router.get('/upload-model', async (req, res) => {
  const hasModel = await fs.pathExists(path.join(__dirname, '../../best.pt'));
  return res.render('upload-model', {
    hasModel,
  });
});

const EXT_ACCEPT = ['.pt', '.pth'];

router.post(
  '/upload-model',
  uploadModel.single('data-model'),
  async (req, res) => {
    if (!req.file) {
      return res.render('upload-model', {
        notFile: true,
      });
    }

    const extname = path.extname(req.file.originalname).toLowerCase();

    if (!EXT_ACCEPT.includes(extname)) {
      return res.render('upload-model', {
        notSupport: true,
      });
    }

    await fs.move(
      path.join(__dirname, '../public/model/', req.file.originalname),
      path.join(__dirname, '../public/model/', 'best.pt'),
      {
        overwrite: true,
      },
    );

    await fs.move(
      path.join(__dirname, '../public/model/best.pt'),
      path.join(__dirname, '../../yolo/best.pt'),
      {
        overwrite: true,
      },
    );

    return res.render('upload-model', {
      justAdd: true,
    });
  },
);

module.exports = router;
