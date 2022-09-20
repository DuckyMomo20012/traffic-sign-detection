import path from 'path';
import { AsyncZipDeflate, Zip, zipSync } from 'fflate';
import fs from 'fs-extra';

async function zipFolderStream(outputFilePath, folderPath) {
  const zippedFile = fs.createWriteStream(outputFilePath);

  const zip = new Zip((err, chunk, final) => {
    zippedFile.write(chunk);

    if (final) {
      zippedFile.end();
    }
  });

  const files = await fs.readdir(folderPath);

  files.forEach((fileName) => {
    const zipFile = new AsyncZipDeflate(fileName);

    zip.add(zipFile);

    const readStream = fs.createReadStream(path.join(folderPath, fileName));

    readStream.on('data', (chunk) => {
      zipFile.push(chunk);
    });

    readStream.on('end', () => {
      zipFile.push(new Uint8Array(), true);
    });
  });

  zip.end();
}

async function zipFolderSync(outputFilePath, folderPath) {
  const files = await fs.readdir(folderPath);

  // NOTE: We have to convert from array to object
  // This object acts like a root directory, please go to fflate doc to see
  // nested folder zip
  const folder = {};
  await (async () => {
    await Promise.all(
      // NOTE: We don't have to convert Buffer to Uint8Array
      files.map(async (fileName) => {
        folder[fileName] = await fs.readFile(path.join(folderPath, fileName));
      }),
    );
  })();

  const zipped = zipSync(folder);

  await fs.writeFile(outputFilePath, zipped);
}

export { zipFolderStream, zipFolderSync };
