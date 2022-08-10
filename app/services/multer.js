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

const IMG_ACCEPT = ['.png', '.jpeg', '.jpg'];

const filterImage = (req, file, cb) => {
  cb(null, IMG_ACCEPT.includes(path.extname(file.originalname).toLowerCase()));
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
