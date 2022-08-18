const { Zip, zipSync, AsyncZipDeflate } = require('fflate');
const fs = require('fs-extra');
const path = require('path');

async function zipFolderStream(outputFilePath, folderPath) {
  const zippedFile = fs.createWriteStream(outputFilePath);

  const zip = new Zip((err, chunk, final) => {
    zippedFile.write(chunk);
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

  const folder = {};
  await (async () => {
    await Promise.all(
      // NOTE: Files now is array of Blob, so we have to convert it to
      // ArrayBuffer and then to Uint8Array
      files.map(async (fileName) => {
        folder[fileName] = await fs.readFile(path.join(folderPath, fileName));
      }),
    );
  })();

  const zipped = zipSync(folder);

  await fs.writeFile(outputFilePath, zipped);
}

exports.zipFolderStream = zipFolderStream;
exports.zipFolderSync = zipFolderSync;
