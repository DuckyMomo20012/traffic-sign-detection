import { Button, Menu, Popover, Text, Tooltip } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';

import { Icon } from '@iconify/react';

const ImageMenu = ({ withExtraMenu, align, setAlign }) => {
  const [isResultOpened, resultHandlers] = useDisclosure(false);
  const [isAlignOpened, alignHandlers] = useDisclosure(false);
  const [withMenu, menuHandlers] = useDisclosure(true);
  const alignRef = useClickOutside(() => alignHandlers.close());

  return (
    <Button.Group
      className={`z-1 absolute right-0 justify-end children:${
        withMenu ? 'visible' : 'invisible'
      } `}
    >
      {withExtraMenu && (
        <>
          <Popover
            onMouseLeave={() => resultHandlers.close()}
            onOpen={() => resultHandlers.open()}
          >
            <Popover.Target>
              <Tooltip
                label="Result"
                opened={isResultOpened ? false : undefined}
                position="top"
              >
                <Button color="dark" compact size="sm" variant="filled">
                  <Icon icon="ic:outline-info" width={18} />
                </Button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">foo bar</Text>
            </Popover.Dropdown>
          </Popover>
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
                    setAlign('flex-start');
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
                    setAlign('center');
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
                    setAlign('flex-end');
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
                  icon={
                    <Icon icon="ic:outline-format-align-center" width={18} />
                  }
                  onClick={() => setAlign('center')}
                >
                  Align center
                </Menu.Item>
                <Menu.Item
                  icon={
                    <Icon icon="ic:outline-format-align-right" width={18} />
                  }
                  onClick={() => setAlign('flex-end')}
                >
                  Align right
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Button.Group>
  );
};

export { ImageMenu };
