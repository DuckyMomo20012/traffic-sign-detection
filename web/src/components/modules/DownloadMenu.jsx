import { Button } from '@mantine/core';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { zipSync } from 'fflate';

const DownloadMenu = ({ files }) => {
  const handleDownloadImageClick = async () => {
    // We have to convert from array to object
    const zipFiles = {};
    await Promise.all(
      // NOTE: Files now is array of Blob, so we have to convert it to
      // ArrayBuffer and then to Uint8Array
      files.map(async (file) => {
        zipFiles[file.name] = new Uint8Array(await file.data.arrayBuffer());
      }),
    );

    // Zip its
    const zipped = zipSync(zipFiles);

    const zipName = uuidv4() + '.zip';

    saveAs(new Blob([zipped]), zipName);
  };

  return (
    <Button onClick={() => handleDownloadImageClick()}>
      Download all images as zip
    </Button>
  );
};

export { DownloadMenu };
