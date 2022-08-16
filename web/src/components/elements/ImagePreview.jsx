import { Box, CloseButton, Image, Text } from '@mantine/core';

const ImagePreview = ({ name, src, onClick, withCloseButton = true }) => {
  return (
    <Box className="relative">
      {withCloseButton && (
        <CloseButton
          className="z-1 absolute right-0 translate-x-1/2 -translate-y-1/2 transform active:-translate-y-1/2 active:translate-x-1/2 active:transform"
          color="rose"
          onClick={onClick}
          radius="xl"
          variant="filled"
        />
      )}
      <Image src={src} withPlaceholder />
      <Text align="center">{name}</Text>
    </Box>
  );
};

export { ImagePreview };
