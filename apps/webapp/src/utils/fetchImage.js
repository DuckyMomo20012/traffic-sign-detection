import { IMG_ACCEPT, MIME_TYPE_ACCEPT } from '@/constants/constants.js';
import axios, { AxiosError } from 'axios';

const fetchImage = async (url) => {
  // NOTE: Pull out the file name from the url and convert extension to
  // lowercase, because image filter only check lowercase extension.
  // Even "multiline" filename 🤪. E.g: foo.SVG\nbar.JPEG =>
  // foo.svg\nbar.jpeg
  let fileName = url
    .split('/')
    .pop()
    .replace(/([^.]+$)/gm, (match) => match.toLowerCase());

  const img = new Image();
  img.src = url;

  try {
    // NOTE: Check if we can decode image from this URL
    await img.decode();

    // NOTE: The check above might pass in some cases, so we have to
    // fetch the image to validate again

    const fileData = await axios.get(url, { responseType: 'blob' });

    // NOTE: Check if extension is valid, image name might not have
    // extension so we have to check the mime type as well
    const isValidFile = [...IMG_ACCEPT, ...MIME_TYPE_ACCEPT].some((ext) => {
      return (
        fileName.toLowerCase().includes(ext) || fileData.data.type.includes(ext)
      );
    });

    if (!isValidFile) {
      throw Error('URL has unsupported image type');
    }

    // NOTE: Append extension from MIME type if image name don't have
    // extension, we don't have to convert extension to lowercase here
    const fileExt = fileName.split('.').pop();
    if (fileExt === fileName) {
      // MIME types e.g: image/jpeg, image/png, image/svg+xml,
      // image/gif, image/webp
      const fileType = fileData.data.type;
      fileName = `${fileName}.${fileType.split('/').pop()}`;
    }

    return {
      name: fileName,
      data: fileData.data,
    };
  } catch (err) {
    if (err instanceof AxiosError || err instanceof DOMException) {
      throw Error("Can't fetch image from URL");
    } else if (err instanceof Error) {
      throw err;
    }
  }
};

export { fetchImage };
