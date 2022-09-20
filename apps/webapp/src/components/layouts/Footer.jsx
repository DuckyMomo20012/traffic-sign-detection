import {
  Anchor,
  Divider,
  Group,
  Image,
  Footer as MantineFooter,
  SimpleGrid,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';

import mantineLogo from '@/imgs/mantine-logo-full.svg';

const Footer = () => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <MantineFooter className="!static">
      <Stack
        align="center"
        className="children:w-1/2 items-center bg-gray-100 py-20"
      >
        <SimpleGrid cols={3}>
          <Stack align="flex-start">
            <Text color="dimmed">Built with</Text>
            <Anchor href="https://mantine.dev/">
              <img alt="Mantine Logo" className="h-8" src={mantineLogo} />
            </Anchor>
            <Anchor href="https://socket.io/">
              <Group spacing="sm">
                <Image src="https://socket.io/images/logo.svg" width={32} />
                <Text>Socket.IO</Text>
              </Group>
            </Anchor>
            <Anchor href="https://github.com/ultralytics/yolov5">
              <Text>YOLOv5</Text>
            </Anchor>
          </Stack>
          <Stack>
            <Text transform="uppercase" weight={700}>
              Help
            </Text>
            <Anchor href="https://github.com/DuckyMomo20012/traffic-sign-detection/issues?q=is%3Aopen+is%3Aissue">
              Report Issues
            </Anchor>
          </Stack>
          <Stack>
            <Text transform="uppercase" weight={700}>
              Project
            </Text>
            <Anchor href="https://github.com/DuckyMomo20012/traffic-sign-detection">
              Github
            </Anchor>
            <Anchor href="https://github.com/DuckyMomo20012/traffic-sign-detection">
              Documentation
            </Anchor>
            <Anchor href="https://github.com/DuckyMomo20012/traffic-sign-detection/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Acommunity">
              Help Us
            </Anchor>
          </Stack>
        </SimpleGrid>
        <Divider my="sm" />
        <Text align="center" size="sm">
          Made with {dark ? '☕️' : '❤️'} by{' '}
          <Anchor href="https://github.com/DuckyMomo20012">Tien Vinh</Anchor>{' '}
          and <Anchor href="https://github.com/lntvan166">Tu Van</Anchor>
        </Text>
      </Stack>
    </MantineFooter>
  );
};

export { Footer };
