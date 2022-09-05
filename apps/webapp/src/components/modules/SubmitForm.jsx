import {
  Button,
  Code,
  Group,
  Space,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';

import { useRef } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { Icon } from '@iconify/react';
import isURL from 'validator/es/lib/isURL';
import {
  IMG_ACCEPT,
  MAX_FILES,
  MIME_TYPE_ACCEPT,
} from '@/constants/constants.js';

const SubmitForm = ({
  form,
  onSubmit,
  isDetecting,
  handleDrop,
  handleReject,
  setError,
  detected,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = form;
  const openRef = useRef(null);

  return (
    <Stack
      align="center"
      component="form"
      mt="md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Dropzone
        accept={MIME_TYPE_ACCEPT}
        className="w-1/2"
        loading={isDetecting}
        maxFiles={MAX_FILES}
        onDragEnter={() => setError('')}
        onDrop={handleDrop}
        onFileDialogOpen={() => setError('')}
        onReject={handleReject}
        openRef={openRef}
        {...register('data-image')}
      >
        <Group position="center">
          <Dropzone.Accept>
            <Icon icon="material-symbols:upload-rounded" width="48" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <Icon icon="material-symbols:close" width="48" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Icon
              icon="material-symbols:add-photo-alternate-outline"
              width="48"
            />
          </Dropzone.Idle>
          <Text>
            Drag images here or click to select files.
            <Space />
            Maximum {MAX_FILES} files.
          </Text>
        </Group>
      </Dropzone>
      <Text>Or</Text>
      <Textarea
        autosize
        className="w-1/2"
        description={`Maximum ${MAX_FILES} URLs`}
        error={formErrors['data-url'] && formErrors['data-url'].message}
        label="Your image URLs:"
        minRows={2}
        placeholder="One URL per line"
        {...register('data-url', {
          validate: (value) => {
            if (value === '') return true;

            const urls = value.split('\n').filter((url) => url !== '');

            if (urls.length > MAX_FILES) {
              return `Maximum ${MAX_FILES} URLs`;
            }

            const uniqueURLs = [...new Set(urls)];

            if (uniqueURLs.length !== urls.length) {
              return 'Duplicate URLs are not allowed';
            }

            const errorLines = urls
              .flatMap((url, index) => {
                const isValid = isURL(url);

                if (!isValid) {
                  // NOTE: Return error index, so we can join with the error
                  // message later
                  return [index + 1];
                }
                return [];
              })
              .filter((line) => line); // NOTE: Filter out undefined

            if (errorLines.length > 0) {
              return `Line ${errorLines.join(', ')}: Invalid URL`;
            }

            return true;
          },
        })}
      />
      <Text>
        Supports{' '}
        {IMG_ACCEPT.map((ext, index) => {
          return (
            <Code color="blue" key={index}>
              {ext}
            </Code>
          );
        }).reduce((prev, curr) => [prev, ', ', curr])}
      </Text>
      <Space h="md" />
      <Button
        disabled={detected}
        leftIcon={<Icon icon="codicon:wand" width="24" />}
        loading={isDetecting}
        size="xl"
        type="submit"
      >
        Detect
      </Button>
    </Stack>
  );
};

export { SubmitForm };
