import { Icon } from '@iconify/react';
import {
  Accordion,
  Anchor,
  Stack,
  Title,
  Text,
  List,
  ThemeIcon,
  Space,
  ScrollArea,
} from '@mantine/core';

const Faq = () => {
  return (
    <Stack align="stretch" className="children:w-1/2 my-40 items-center">
      <Title align="center">Frequently Asked Questions</Title>
      <Accordion radius="md" variant="separated">
        <Accordion.Item value="detect-time">
          <Accordion.Control>
            How long does it take to detect the traffic signs?
          </Accordion.Control>
          <Accordion.Panel>
            It usually takes about 1-2 minutes to detect the traffic signs.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="incorrect-result">
          <Accordion.Control>
            Why does the result seem incorrect?
          </Accordion.Control>
          <Accordion.Panel>
            The model still needs extensive training. We are trying to improve
            our model to give a better result.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="different-extension">
          <Accordion.Control>
            Why does the result image have different file name?
          </Accordion.Control>
          <Accordion.Panel>
            When the YOLOv5 processing the image with the extension other than
            .png or .jpg, it will detect and save with .jpg extension.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="traffic-sign-list">
          <Accordion.Control>
            How many traffic signs can it detect?
          </Accordion.Control>
          <Accordion.Panel>
            <Text>
              The model is trained to detect up to{' '}
              <Text component="span" weight={700}>
                36
              </Text>{' '}
              traffic signs:
            </Text>
            <Space h="md" />
            <ScrollArea style={{ height: 250 }}>
              <List
                icon={
                  <ThemeIcon color="green" radius="xl">
                    <Icon icon="ic:outline-check-circle-outline" width={24} />
                  </ThemeIcon>
                }
                withPadding
              >
                <List.Item>Cycle Zone</List.Item>
                <List.Item>Danger Ahead</List.Item>
                <List.Item>Deer Zone</List.Item>
                <List.Item>End of Right Road Go straight</List.Item>
                <List.Item>Give Way</List.Item>
                <List.Item>Go Left or Straight</List.Item>
                <List.Item>Go Right or Straight</List.Item>
                <List.Item>Go Straight</List.Item>
                <List.Item>Huddle Road</List.Item>
                <List.Item>Left Curve Ahead</List.Item>
                <List.Item>Left Sharp Curve</List.Item>
                <List.Item>No Entry</List.Item>
                <List.Item>No Over Taking Trucks</List.Item>
                <List.Item>No Over Taking</List.Item>
                <List.Item>No Stopping</List.Item>
                <List.Item>No Waiting</List.Item>
                <List.Item>Pedestrian</List.Item>
                <List.Item>Right Curve Ahead</List.Item>
                <List.Item>Right Sharp Curve</List.Item>
                <List.Item>Road Work</List.Item>
                <List.Item>RoundAbout</List.Item>
                <List.Item>Slippery Road</List.Item>
                <List.Item>Snow Warning Sign</List.Item>
                <List.Item>Speed Limit 100</List.Item>
                <List.Item>Speed Limit 120</List.Item>
                <List.Item>Speed Limit 20</List.Item>
                <List.Item>Speed Limit 30</List.Item>
                <List.Item>Speed Limit 50</List.Item>
                <List.Item>Speed Limit 60</List.Item>
                <List.Item>Speed Limit 70</List.Item>
                <List.Item>Speed Limit 80</List.Item>
                <List.Item>Stop</List.Item>
                <List.Item>Traffic Signals Ahead</List.Item>
                <List.Item>Truck Sign</List.Item>
                <List.Item>Turn Left</List.Item>
                <List.Item>Turn Right</List.Item>
              </List>
            </ScrollArea>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="support">
          <Accordion.Control>How can I support?</Accordion.Control>
          <Accordion.Panel>
            We always welcome feedback, you can open an issue to report bugs or
            request new feature on our{' '}
            <Anchor href="https://github.com/DuckyMomo20012/traffic-sign-detection/issues?q=is%3Aopen+is%3Aissue">
              Github
            </Anchor>{' '}
            repository.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export { Faq };
