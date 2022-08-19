import {
  ActionIcon,
  Box,
  CloseButton,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';

import { Icon } from '@iconify/react';

const ImagePreview = ({
  name,
  src,
  onCloseClick,
  onDownloadClick,
  withCloseButton = true,
  withDownloadButton = false,
}) => {
  return (
    <Box className="relative">
      <Group
        spacing="xs"
        className="z-1 bg-white-500 absolute right-0 translate-x-1/2 -translate-y-1/2 transform active:translate-x-1/2 active:-translate-y-1/2 active:transform"
      >
        {withCloseButton && (
          <CloseButton
            color="rose"
            onClick={onCloseClick}
            radius="xl"
            variant="filled"
          />
        )}
        {withDownloadButton && (
          <Tooltip label="Download">
            <ActionIcon onClick={onDownloadClick} variant="filled" color="blue">
              <Icon icon="ic:outline-sim-card-download" />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      <Image src={src} withPlaceholder />
      <Text align="center">{name}</Text>
    </Box>
  );
};

export { ImagePreview };
