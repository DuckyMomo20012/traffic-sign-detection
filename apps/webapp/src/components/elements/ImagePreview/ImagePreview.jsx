import { Image, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure, useElementSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { ImageMenu } from './ImageMenu.jsx';
import { ImageResizer } from './ImageResizer.jsx';

const ImagePreview = ({ caption, src, onRemoveClick, onDownloadClick }) => {
  const { ref, width } = useElementSize();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isModalOpened, modalHandlers] = useDisclosure(false);
  const [withExtraMenu, setWithExtraMenu] = useState(false);
  const [align, setAlign] = useState('center');

  const actions = {
    align: setAlign,
    download: onDownloadClick,
    remove: onRemoveClick,
    viewOriginal: () => {
      window.open(src, '_blank');
    },
    fullScreen: () => {
      modalHandlers.open();
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

  // NOTE: Don't set placeHolder for Image Modal because the image already
  // loaded
  return (
    <>
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

      <Modal
        fullScreen
        onClose={() => modalHandlers.close()}
        opened={isModalOpened}
        title={caption}
      >
        <Image src={src} />
      </Modal>
    </>
  );
};

export { ImagePreview };
