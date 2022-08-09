// SET STORAGE
const multer = require('multer');
const path = require('path');

const storageImage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    // const str = path.join(__dirname, '../public/img/')
    cb(null, path.join(__dirname, '../public/img'));
  },
});

const storageModel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/model'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.uploadImage = multer({ storage: storageImage });
exports.uploadModel = multer({ storage: storageModel });
