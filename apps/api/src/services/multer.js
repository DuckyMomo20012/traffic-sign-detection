// SET STORAGE
const multer = require('multer');
const path = require('path');
const { IMG_ACCEPT, MIME_TYPE_ACCEPT } = require('../constants/constants');

const storageImage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    // const str = path.join(__dirname, '../public/img/')
    cb(null, path.join(__dirname, '../public/img'));
  },
});

const filterImage = (req, file, cb) => {
  const isValid = [...IMG_ACCEPT, ...MIME_TYPE_ACCEPT].some((ext) => {
    return (
      path.extname(file.originalname).toLowerCase().includes(ext) ||
      file.mimetype.includes(ext)
    );
  });

  cb(null, isValid);
};

const storageModel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/model'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const MODEL_ACCEPT = ['.pt', '.pth'];

const filterModel = (req, file, cb) => {
  cb(
    null,
    MODEL_ACCEPT.includes(path.extname(file.originalname).toLowerCase()),
  );
};

exports.uploadImage = multer({
  storage: storageImage,
  fileFilter: filterImage,
});
exports.uploadModel = multer({
  storage: storageModel,
  fileFilter: filterModel,
});
