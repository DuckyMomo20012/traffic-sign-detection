import { Box } from '@mantine/core';
import { Resizable } from 're-resizable';

const ImageResizer = ({ children }) => {
  return (
    <Resizable
      className="group !h-min max-w-full"
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      handleClasses={{
        right:
          'justify-center flex items-center transform -translate-x-2 group-hover:children:visible group-active:children:visible',
        left: 'justify-center flex items-center transform translate-x-2 group-hover:children:visible group-active:children:visible',
      }}
      handleComponent={{
        right: (
          <Box className="invisible h-1/4 w-1.5 rounded-md bg-gray-500 delay-200" />
        ),
        left: (
          <Box className="invisible h-1/4 w-1.5 rounded-md bg-gray-500 delay-200" />
        ),
      }}
      lockAspectRatio={true}
      minWidth="52px"
    >
      {children}
    </Resizable>
  );
};

export { ImageResizer };
