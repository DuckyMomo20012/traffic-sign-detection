import {
  ActionIcon,
  Anchor,
  AppShell,
  Button,
  Center,
  Footer,
  Group,
  Header,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

import { DownloadMenu } from '@/components/modules/DownloadMenu';
import { Dropzone } from '@mantine/dropzone';
import { Icon } from '@iconify/react';
import { ImagePreview } from '@/components/elements/ImagePreview';
import axios from 'axios';
import { socket } from '@/socket/socket.js';
import { useForm } from 'react-hook-form';

const MAX_FILES = 3;

const HomePage = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { register, handleSubmit, setValue, reset } = useForm();
  const dark = colorScheme === 'dark';
  const openRef = useRef(null);
  const [files, setFiles] = useState([]);
  // const files = useWatch({ control, name: 'data-image' });
  const [error, setError] = useState('');
  const [loadingDetect, setLoadingDetect] = useState(false);
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
      setLoadingDetect(false);
      setDetected(true);
    });

    return () => socket.off('detect-finished');
  }, []);

  const handleRemoveImageClick = (index) => {
    // Remove file at index
    const newFiles = files.filter((file, i) => i !== index);
    setValue('data-image', newFiles);
    setFiles(newFiles);
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
        onClick={() => handleRemoveImageClick(index)}
        src={imageSrc}
        withCloseButton={!detected}
      />
    );
  });

  const handleReject = (rejectedFiles) => {
    if (rejectedFiles.length > MAX_FILES)
      setError('Maximum file count exceeded. Please select less than 3 files.');
  };

  const handleDrop = (selectedFiles) => {
    // NOTE: Have to set the value here because I can' get files from the
    // Dropzone component
    setValue('data-image', selectedFiles);

    const newFiles = selectedFiles.map((file) => {
      return {
        name: file.name,
        data: file,
      };
    });

    setFiles(newFiles);
  };

  const onSubmit = async (data) => {
    setLoadingDetect(true);

    const formData = new FormData();
    const fileList = [...data['data-image']];

    // NOTE: Append only one file to 'data-image' to the form data. Don't append
    // a list!
    fileList.forEach((file) => {
      formData.append('data-image', file);
    });

    // NOTE: I have config proxy for Vite to forward the request to the targeted
    // backend URL
    await axios.post('/api/run-model', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
            <Icon icon="ant-design:github-filled" width="32" />
            <ActionIcon
              color="rose"
              onClick={() => toggleColorScheme()}
              variant="light"
            >
              <Icon
                height={24}
                icon={dark ? 'ic:outline-dark-mode' : 'ic:outline-light-mode'}
                width={24}
              />
            </ActionIcon>
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
          className="w-1/2"
          loading={loadingDetect}
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
            <Text>Drag images here or click to select files</Text>
          </Group>
        </Dropzone>
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
          leftIcon={<Icon icon="codicon:wand" width="24" />}
          loading={loadingDetect}
          size="xl"
          type="submit"
        >
          Detect
        </Button>
        {files?.length > 0 && (
          <>
            <Group className="self-end">
              {detected && <DownloadMenu files={files} />}
              <Button onClick={() => handleClearImageClick()}>
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
