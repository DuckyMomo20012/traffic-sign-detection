import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Anchor,
  Group,
  Header as MantineHeader,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';

const Header = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <MantineHeader
      className="flex items-center justify-end"
      height={48}
      px={24}
    >
      <Group>
        <Tooltip label="Source code">
          <Anchor
            href="https://github.com/DuckyMomo20012/traffic-sign-detection"
            target="_blank"
          >
            <ActionIcon size="lg" variant="outline">
              <Icon icon="ant-design:github-filled" width={24} />
            </ActionIcon>
          </Anchor>
        </Tooltip>
        <Tooltip label={dark ? 'Light mode' : 'Dark mode'}>
          <ActionIcon
            color="blue"
            onClick={() => toggleColorScheme()}
            size="lg"
            variant="outline"
          >
            <Icon
              icon={dark ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'}
              width={24}
            />
          </ActionIcon>
        </Tooltip>
      </Group>
    </MantineHeader>
  );
};

export { Header };
