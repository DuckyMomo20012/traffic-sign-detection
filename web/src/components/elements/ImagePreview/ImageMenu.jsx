import { Button, Menu, Popover, Text, Tooltip } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

import { Icon } from '@iconify/react';

const ImageMenu = ({ withExtraMenu }) => {
  const [popoverOpened, popoverHandlers] = useDisclosure(false);
  const ref = useClickOutside(() => popoverHandlers.close());

  return (
    <Button.Group className="z-1 absolute right-0 justify-end">
      {withExtraMenu && (
        <>
          <Popover
            onClick={() => popoverHandlers.toggle()}
            opened={popoverOpened}
          >
            <Popover.Target>
              <Tooltip
                label="Result"
                opened={popoverOpened ? false : undefined}
                position="top"
              >
                <Button color="dark" compact size="sm" variant="filled">
                  <Icon icon="ic:outline-info" width={18} />
                </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <Text ref={ref} size="xs">
                foo bar
              </Text>
            </Popover.Dropdown>
          </Popover>
          <Tooltip label="Download" position="top">
            <Button color="dark" compact size="sm" variant="filled">
              <Icon icon="ic:outline-download-for-offline" width={18} />
            </Button>
          </Tooltip>
          <Tooltip label="Remove" position="top">
            <Button color="dark" compact size="sm" variant="filled">
              <Icon icon="ic:baseline-close" width={18} />
            </Button>
          </Tooltip>
        </>
      )}

      <Menu position="right-start" width={150}>
        <Menu.Target>
          <Tooltip label="More actions" position="top">
            <Button color="dark" compact size="sm" variant="filled">
              <Icon icon="ic:outline-more-horiz" width={18} />
            </Button>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<Icon icon="ic:outline-info" width={18} />}>
            Result
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<Icon icon="ic:baseline-close" width={18} />}>
            Remove
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<Icon icon="ic:outline-zoom-in" width={18} />}>
            Full screen
          </Menu.Item>
          <Menu.Item
            component="a"
            href=""
            icon={<Icon icon="ic:outline-north-east" width={18} />}
            target="_blank"
          >
            View original
          </Menu.Item>
          <Menu.Item
            icon={<Icon icon="ic:outline-download-for-offline" width={18} />}
          >
            Download
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Button.Group>
  );
};

export { ImageMenu };
