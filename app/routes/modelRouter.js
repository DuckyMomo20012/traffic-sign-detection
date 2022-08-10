const express = require('express');

const router = express.Router();
const fs = require('fs-extra');
const fg = require('fast-glob');
const path = require('path');
const { socket } = require('../socket/socket.js');

const { uploadModel } = require('../services/multer');

router.get('/upload-model', async (req, res) => {
  const models = await fg(path.posix.join(__dirname, '../../yolo/upload/*.pt'));

  const hasModel = !!models;
  return res.render('upload-model', {
    hasModel,
  });
});

router.post(
  '/upload-model',
  uploadModel.single('data-model'),
  async (req, res) => {
    if (!req.file) {
      return res.render('upload-model', {
        notFile: true,
      });
    }

    await fs.move(
      path.join(__dirname, '../public/model/', req.file.originalname),
      path.join(__dirname, '../../yolo/upload/', req.file.originalname),
      {
        overwrite: true,
      },
    );

    // Emit event to YOLO server to reload model
    socket.emit('update-model', { file: req.file.originalname });

    return res.render('upload-model', {
      justAdd: true,
    });
  },
);

module.exports = router;
