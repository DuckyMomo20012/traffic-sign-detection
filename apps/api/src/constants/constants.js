const path = require('path');

const IMG_ACCEPT = ['.png', '.jpeg', '.jpg', '.webp'];

const MIME_TYPE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

const UPLOAD_DIR = path.join(__dirname, '../../../shared/assets/upload/');

const RESULT_DIR = path.join(__dirname, '../../../shared/assets/result/');

module.exports = { IMG_ACCEPT, MIME_TYPE_ACCEPT, UPLOAD_DIR, RESULT_DIR };
