import { Icon } from '@iconify/react';
import { Box, Button, Menu, Text, Tooltip } from '@mantine/core';

const ImageActionMenu = ({ menuHandlers, actions }) => {
  return (
    <Menu
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
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item
          icon={<Icon icon="ic:baseline-close" width={18} />}
          onClick={() => actions.remove()}
        >
          Remove
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<Icon icon="ic:outline-zoom-in" width={18} />}
          onClick={() => actions.fullScreen()}
        >
          Full screen
        </Menu.Item>
        <Menu.Item
          icon={<Icon icon="ic:outline-north-east" width={18} />}
          onClick={() => actions.viewOriginal()}
        >
          View original
        </Menu.Item>
        <Menu.Item
          icon={<Icon icon="ic:outline-download-for-offline" width={18} />}
          onClick={() => actions.download()}
        >
          Download
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<Icon icon="ic:outline-format-align-left" width={18} />}
          rightSection={<Icon icon="ic:baseline-chevron-right" width={18} />}
        >
          <Menu
            component={Text}
            onClick={(e) => {
              // NOTE: Stop menu close when clicking on the menu item. We can
              // set closeMenuOnClick to false for Menu.Item wrapper, but it
              // won't close on MenuItem click of this sub-Menu.
              e.stopPropagation();
            }}
            position="right-center"
            trigger="hover"
            width={150}
          >
            <Menu.Target>
              <Text>Align</Text>
            </Menu.Target>
            <Menu.Dropdown className="translate-x-4 transform" p={4}>
              <Menu.Label>Align</Menu.Label>
              <Menu.Item
                component={Box}
                icon={<Icon icon="ic:outline-format-align-left" width={18} />}
                onClick={() => actions.align('flex-start')}
              >
                Align left
              </Menu.Item>
              <Menu.Item
                component={Box}
                icon={<Icon icon="ic:outline-format-align-center" width={18} />}
                onClick={() => actions.align('center')}
              >
                Align center
              </Menu.Item>
              <Menu.Item
                component={Box}
                icon={<Icon icon="ic:outline-format-align-right" width={18} />}
                onClick={() => actions.align('flex-end')}
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
