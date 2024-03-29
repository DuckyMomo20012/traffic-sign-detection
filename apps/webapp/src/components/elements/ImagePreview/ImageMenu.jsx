import { Icon } from '@iconify/react';
import { Button, Popover, Tooltip } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

import { ImageActionMenu } from './ImageActionMenu.jsx';

const ImageMenu = ({ withExtraMenu, align, actions }) => {
  const [isAlignOpened, alignHandlers] = useDisclosure(false);
  const [withMenu, menuHandlers] = useDisclosure(true);
  const alignRef = useClickOutside(() => alignHandlers.close());

  // NOTE: Set delay-200 to prevent the menu flashing problem
  return (
    <Button.Group
      className={`z-1 invisible absolute right-0 justify-end delay-200 ${
        withMenu ? 'group-hover:visible' : ''
      }`}
    >
      {withExtraMenu && (
        <>
          <Popover
            onClick={() => alignHandlers.toggle()}
            opened={isAlignOpened}
          >
            <Popover.Target>
              <Tooltip
                label="Align"
                opened={isAlignOpened ? false : undefined}
                position="top"
              >
                <Button
                  color="dark"
                  compact
                  ref={alignRef}
                  size="sm"
                  variant="filled"
                >
                  {
                    {
                      center: (
                        <Icon
                          icon="ic:outline-format-align-center"
                          width={18}
                        />
                      ),
                      'flex-start': (
                        <Icon icon="ic:outline-format-align-left" width={18} />
                      ),
                      'flex-end': (
                        <Icon icon="ic:outline-format-align-right" width={18} />
                      ),
                    }[align]
                  }
                </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown
              className="border-0 bg-transparent p-0"
              position="center"
            >
              <Button.Group>
                <Button
                  color="dark"
                  compact
                  onClick={() => {
                    actions.align('flex-start');
                    alignHandlers.close();
                  }}
                  size="sm"
                  variant="filled"
                >
                  <Icon icon="ic:outline-format-align-left" width={18} />
                </Button>
                <Button
                  color="dark"
                  compact
                  onClick={() => {
                    actions.align('center');
                    alignHandlers.close();
                  }}
                  size="sm"
                  variant="filled"
                >
                  <Icon icon="ic:outline-format-align-center" width={18} />
                </Button>
                <Button
                  color="dark"
                  compact
                  onClick={() => {
                    actions.align('flex-end');
                    alignHandlers.close();
                  }}
                  size="sm"
                  variant="filled"
                >
                  <Icon icon="ic:outline-format-align-right" width={18} />
                </Button>
              </Button.Group>
            </Popover.Dropdown>
          </Popover>
          <Tooltip label="Download" position="top">
            <Button
              color="dark"
              compact
              onClick={() => actions.download()}
              size="sm"
              variant="filled"
            >
              <Icon icon="ic:outline-download-for-offline" width={18} />
            </Button>
          </Tooltip>
          <Tooltip label="Remove" position="top">
            <Button
              color="dark"
              compact
              onClick={() => actions.remove()}
              size="sm"
              variant="filled"
            >
              <Icon icon="ic:baseline-close" width={18} />
            </Button>
          </Tooltip>
        </>
      )}
      <ImageActionMenu actions={actions} menuHandlers={menuHandlers} />
    </Button.Group>
  );
};

export { ImageMenu };
