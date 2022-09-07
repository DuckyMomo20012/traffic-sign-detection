// SET STORAGE
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { IMG_ACCEPT, MIME_TYPE_ACCEPT } from '../constants/constants.js';

const storageImage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, fileURLToPath(new URL('../public/img', import.meta.url)));
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
    cb(null, fileURLToPath(new URL('../public/model', import.meta.url)));
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

export const uploadImage = multer({
  storage: storageImage,
  fileFilter: filterImage,
});
export const uploadModel = multer({
  storage: storageModel,
  fileFilter: filterModel,
});
