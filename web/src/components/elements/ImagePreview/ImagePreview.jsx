import { Image, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import { ImageMenu } from './ImageMenu.jsx';
import { ImageResizer } from './ImageResizer.jsx';
import { useElementSize } from '@mantine/hooks';

const ImagePreview = ({ name, src, onCloseClick, onDownloadClick }) => {
  const { ref, width, height } = useElementSize();

  const [withMenu, setWithMenu] = useState(false);
  const [withExtraMenu, setWithExtraMenu] = useState(false);

  const handleRef = (el) => {
    if (!el) {
      return;
    }

    ref.current = el;

    ref.current.onload = () => {
      // NOTE: Wait for image to fully load to show the menu
      setWithMenu(true);
    };
  };

  useEffect(() => {
    if (width < 250) {
      setWithExtraMenu(false);
    } else {
      setWithExtraMenu(true);
    }
  }, [width]);

  return (
    <Stack>
      <ImageResizer>
        {withMenu && <ImageMenu withExtraMenu={withExtraMenu} />}
        <Image imageRef={handleRef} src={src} withPlaceholder />
        <Text align="center" className="absolute w-full break-all">
          {name}
        </Text>
      </ImageResizer>
    </Stack>
  );
};

export { ImagePreview };
