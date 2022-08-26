import { Button, Menu, Text, Tooltip } from '@mantine/core';

import { Icon } from '@iconify/react';

const ImageActionMenu = ({ menuHandlers, setAlign }) => {
  return (
    <Menu
      closeOnItemClick={false}
      onClose={() => menuHandlers.open()}
      onOpen={() => menuHandlers.close()}
      position="right-start"
      width={150}
    >
      <Menu.Target>
        <Tooltip label="More actions" position="top">
          <Button color="dark" compact size="sm" variant="filled">
            <Icon icon="ic:outline-more-horiz" width={18} />
          </Button>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown className="-translate-x-7 translate-y-3 transform last:visible">
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
        <Menu.Divider />
        <Menu.Item
          icon={<Icon icon="ic:outline-format-align-left" width={18} />}
        >
          <Menu position="right-center" width={150}>
            <Menu.Target>
              <Text>Align</Text>
            </Menu.Target>
            <Menu.Dropdown p={4}>
              <Menu.Label>ALIGN</Menu.Label>
              <Menu.Item
                icon={<Icon icon="ic:outline-format-align-left" width={18} />}
                onClick={() => setAlign('flex-start')}
              >
                Align left
              </Menu.Item>
              <Menu.Item
                icon={<Icon icon="ic:outline-format-align-center" width={18} />}
                onClick={() => setAlign('center')}
              >
                Align center
              </Menu.Item>
              <Menu.Item
                icon={<Icon icon="ic:outline-format-align-right" width={18} />}
                onClick={() => setAlign('flex-end')}
              >
                Align right
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export { ImageActionMenu };
