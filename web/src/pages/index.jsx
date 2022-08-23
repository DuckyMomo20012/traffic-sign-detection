import {
  ActionIcon,
  Anchor,
  AppShell,
  Button,
  Center,
  Code,
  Footer,
  Group,
  Header,
  Loader,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';

import { DownloadMenu } from '@/components/modules/DownloadMenu';
import { Dropzone } from '@mantine/dropzone';
import { Icon } from '@iconify/react';
import { ImagePreview } from '@/components/elements/ImagePreview';
import isURL from 'validator/es/lib/isURL';
import { saveAs } from 'file-saver';
import { socket } from '@/socket/socket.js';
import { useForm } from 'react-hook-form';

const MAX_FILES = 3;
const IMG_ACCEPT = ['.png', '.jpeg', '.jpg'];
const MIME_TYPE_ACCEPT = ['image/png', 'image/jpeg'];

const HomePage = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError: setFormError,
    formState: { errors: formErrors },
  } = useForm({ criteriaMode: 'all', mode: 'onChange' });
  const dark = colorScheme === 'dark';
  const openRef = useRef(null);
  const [files, setFiles] = useState([]);
  // const files = useWatch({ control, name: 'data-image' });
  const [error, setError] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    socket.on('detect-finished', async (data) => {
      const { idFolder } = data;
      const req = await axios.get(`/api/result/${idFolder}`);

      const fileInfo = req.data;
      const fileData = await Promise.all(
        fileInfo.map(async ({ name, url }) => {
          const fileReq = await axios.get(url, { responseType: 'blob' });
          return {
            name,
            data: fileReq.data,
          };
        }),
      );

      setFiles(fileData);
      setIsDetecting(false);
      setDetected(true);

      socket.emit('delete-folder', { idFolder });
    });

    socket.on('detect-status', (data) => {
      const { status, msg } = data;

      if (status === 'error') {
        setError(msg);
        setIsDetecting(false);
      }
    });

    return () => {
      socket.off('detect-finished');
      socket.off('detect-status');
    };
  }, []);

  const handleRemoveImageClick = (index) => {
    // Remove file at index
    const newFiles = files.filter((file, i) => i !== index);
    setValue('data-image', newFiles);
    setFiles(newFiles);
  };

  const handleDownloadImageClick = (index) => {
    const file = files[index];
    // NOTE: File already have Blob type as response from server
    saveAs(file.data, file.name);
  };

  const handleClearImageClick = () => {
    // Reset form
    reset();
    // Clear files
    setFiles([]);
    setDetected(false);
  };

  const previews = files?.map((file, index) => {
    // NOTE: Response image with have "Blob" type, Upload image will have "File" type
    const imageSrc = URL.createObjectURL(file.data);
    return (
      <ImagePreview
        key={index}
        name={file.name}
        onCloseClick={() => handleRemoveImageClick(index)}
        onDownloadClick={() => handleDownloadImageClick(index)}
        src={imageSrc}
        withCloseButton={!detected && !isDetecting}
        withDownloadButton={detected}
      />
    );
  });

  const handleReject = (rejectedFiles) => {
    if (rejectedFiles.length > MAX_FILES)
      setError(
        `Maximum file count exceeded. Please select less than ${MAX_FILES} files.`,
      );
  };

  const handleDrop = (selectedFiles) => {
    // NOTE: Have to set the value here because I can' get files from the
    // Dropzone component

    const newFiles = selectedFiles.map((file) => {
      return {
        name: file.name,
        data: file,
      };
    });

    setValue('data-image', newFiles);
    setFiles(newFiles);
    setDetected(false);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    const fileImages = [...data['data-image']];
    // Filter out empty string
    const dataURLs = data['data-url'].split('\n').filter((url) => url);
    let fileURLs = [];
    try {
      fileURLs = await Promise.all(
        dataURLs.map(async (url, index) => {
          // Pull out the file name from the url
          let fileName = url.split('/').pop();

          const img = new Image();
          img.src = url;

          try {
            // NOTE: Check if we can decode image from this URL
            await img.decode();

            // NOTE: Check above might pass in some cases, so we have to fetch
            // the image to validate again

            const fileData = await axios.get(url, { responseType: 'blob' });

            // NOTE: Check if extension is valid, image name might not have
            // extension so we have to check the mime type as well
            const isValidFile = [...IMG_ACCEPT, ...MIME_TYPE_ACCEPT].some(
              (ext) => {
                return (
                  fileName.toLowerCase().includes(ext) ||
                  fileData.data.type.includes(ext)
                );
              },
            );

            if (!isValidFile) {
              throw Error(
                `URL has unsupported image type at line ${index + 1}`,
              );
            }

            // NOTE: Append extension from MIME type if image name don't have
            // extension
            // REVIEW: Convert extension to lowercase to avoid error
            const fileExt = fileName.split('.').pop();
            if (fileExt === fileName) {
              // MIME types e.g: image/jpeg, image/png, image/svg+xml,
              // image/gif, image/webp
              const fileType = fileData.data.type;
              fileName = `${fileName}.${fileType.split('/').pop()}`;
            }

            return {
              name: fileName,
              data: fileData.data,
            };
          } catch (err) {
            if (err instanceof AxiosError || err instanceof DOMException) {
              throw Error(`Can't fetch image from URL at line ${index + 1}`);
            } else if (err instanceof Error) {
              throw err;
            }
          }
        }),
      );
    } catch (err) {
      // NOTE: We only set error message for our custom error
      if (err instanceof Error) {
        setFormError('data-url', {
          type: 'validate',
          message: err.message,
        });
      }

      // NOTE: We don't want to submit the form if there is an error
      return;
    }

    const validFileURLs = fileURLs.filter((file) => file);

    const fileList = [...fileImages, ...validFileURLs];

    if (fileList.length === 0) {
      setError("Please upload your images or enter image's URL");
      return;
    }

    setError('');
    setIsDetecting(true);

    // NOTE: Append only one file to 'data-image' to the form data. Don't append
    // a list!
    fileList.forEach((file) => {
      // NOTE: Provide file name, if not Blob file with have filename "blob"
      formData.append('data-image', file.data, file.name);
    });

    // NOTE: I have config proxy for Vite to forward the request to the targeted
    // backend URL
    try {
      await axios.post('/api/run-model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // timeout after 5 seconds, this should be longer than socket timeout
        timeout: 5000,
      });
    } catch (err) {
      setError('Service is unavailable. Please try again later');
      setIsDetecting(false);
    }
  };

  return (
    <AppShell
      footer={
        <Footer>
          <Group position="center">
            <Text size="sm">
              Made with {dark ? '☕️' : '❤️'} by{' '}
              <Anchor href="https://github.com/DuckyMomo20012">
                DuckyMomo20012
              </Anchor>{' '}
              and <Anchor href="https://github.com/lntvan166">Tu Van</Anchor>
            </Text>
          </Group>
        </Footer>
      }
      header={
        <Header className="flex items-center justify-end" height={48} p={24}>
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
                color="rose"
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
        </Header>
      }
    >
      <Center className="h-25 flex items-center justify-center">
        <Title>
          Detect your{' '}
          <Text
            component="span"
            gradient={{ from: 'rose', to: 'orange' }}
            variant="gradient"
          >
            traffic sign
          </Text>{' '}
          now
        </Title>
      </Center>
      <Stack
        align="center"
        component="form"
        mt="md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Dropzone
          accept={['image/png', 'image/jpeg']}
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
              Drag images here or click to select files, maximum {MAX_FILES}{' '}
              files.
              <Space />
              Support only <Code color="rose">.PNG</Code> and{' '}
              <Code color="rose">.JPG</Code> files
            </Text>
            <Text></Text>
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

              const errorLines = urls
                .map((url, index) => {
                  const isValid = isURL(url);

                  if (!isValid) {
                    // NOTE: Return error index, so we can join with the error
                    // message later
                    return index + 1;
                  }
                })
                .filter((line) => line); // NOTE: Filter out undefined

              if (errorLines.length > 0) {
                return `Invalid URL at line ${errorLines.join(', ')}`;
              }

              return true;
            },
          })}
        />
        {isDetecting && (
          <Group>
            <Text>Detecting... Please don&apos;t close this page</Text>
            <Loader size="xs" />
          </Group>
        )}
        {error && (
          <Group spacing="sm">
            <Icon
              className="text-red-600"
              icon="material-symbols:close"
              width="24"
            />
            <Text color="red">{error}</Text>
          </Group>
        )}
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
        {files?.length > 0 && (
          <>
            <Group className="self-end">
              {detected && <DownloadMenu files={files} />}
              <Button
                disabled={isDetecting}
                onClick={() => handleClearImageClick()}
              >
                Clear all images
              </Button>
            </Group>
            <Text
              gradient={{ from: 'rose', to: 'orange' }}
              size="xl"
              variant="gradient"
            >
              {detected ? 'Detected' : 'Preview'}
            </Text>
          </>
        )}
        <SimpleGrid
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
          cols={MAX_FILES}
          mt={previews ? 'xl' : 0}
          spacing="xl"
        >
          {previews}
        </SimpleGrid>
      </Stack>
      <Space h="xl" />
    </AppShell>
  );
};

export { HomePage };
