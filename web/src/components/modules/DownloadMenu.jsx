import { Button, Menu } from '@mantine/core';

import { Icon } from '@iconify/react';
import { saveAs } from 'file-saver';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { zipSync } from 'fflate';

const DownloadMenu = ({ files }) => {
  const zipFolder = useMemo(() => {
    // We have to convert from array to object, this acts like root directory
    const folder = {};
    (async () => {
      await Promise.all(
        // NOTE: Files now is array of Blob, so we have to convert it to
        // ArrayBuffer and then to Uint8Array
        files.map(async (file) => {
          folder[file.name] = new Uint8Array(await file.data.arrayBuffer());
        }),
      );
    })();

    return folder;
  }, [files]);

  const handleZIPClick = () => {
    const zipped = zipSync(zipFolder);

    const zipName = uuidv4() + '.zip';

    saveAs(new Blob([zipped]), zipName);
  };

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button>Download</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<Icon icon="ic:outline-folder-zip" width="24" />}
          onClick={handleZIPClick}
        >
          .zip
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { DownloadMenu };
