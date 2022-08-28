import { Accordion, Anchor, Stack, Title } from '@mantine/core';

const Faq = () => {
  return (
    <Stack align="stretch" className="children:w-1/2 my-40 items-center">
      <Title align="center">Frequently Asked Questions</Title>
      <Accordion>
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
