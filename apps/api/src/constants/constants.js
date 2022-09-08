import { fileURLToPath } from 'url';

const IMG_ACCEPT = ['.png', '.jpeg', '.jpg', '.webp'];

const MIME_TYPE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

// NOTE: Only use URL when we need __dirname
const UPLOAD_DIR = fileURLToPath(
  new URL('../../../../libs/shared/assets/src/upload/', import.meta.url),
);

const RESULT_DIR = fileURLToPath(
  new URL('../../../../libs/shared/assets/src/result/', import.meta.url),
);

export { IMG_ACCEPT, MIME_TYPE_ACCEPT, UPLOAD_DIR, RESULT_DIR };
