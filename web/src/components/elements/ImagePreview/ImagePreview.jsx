import { Image, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import { ImageMenu } from './ImageMenu.jsx';
import { ImageResizer } from './ImageResizer.jsx';
import { useElementSize } from '@mantine/hooks';

const ImagePreview = ({ caption, src, onRemoveClick, onDownloadClick }) => {
  const { ref, width, height } = useElementSize();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [withExtraMenu, setWithExtraMenu] = useState(false);
  const [align, setAlign] = useState('center');

  const actions = {
    align: setAlign,
    download: onDownloadClick,
    remove: onRemoveClick,
    viewOriginal: () => {
      window.open(src, '_blank');
    },
  };

  const handleRef = (el) => {
    if (!el) {
      return;
    }

    ref.current = el;

    ref.current.onload = () => {
      // NOTE: Wait for image to fully load to show the menu
      setIsImageLoaded(true);
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
    <Stack align={align}>
      <ImageResizer>
        {isImageLoaded && (
          <ImageMenu
            actions={actions}
            align={align}
            withExtraMenu={withExtraMenu}
          />
        )}
        <Image imageRef={handleRef} src={src} withPlaceholder />
      </ImageResizer>
      {isImageLoaded && (
        <Text align="center" className="break-all" style={{ width }}>
          {caption}
        </Text>
      )}
    </Stack>
  );
};

export { ImagePreview };
