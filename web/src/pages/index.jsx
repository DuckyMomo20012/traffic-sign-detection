import {
  Alert,
  AppShell,
  Button,
  Center,
  Code,
  Group,
  Header as AppShellHeader,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
  Footer as AppShellFooter,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Dropzone } from '@mantine/dropzone';
import { Icon } from '@iconify/react';
import axios from 'axios';
import isURL from 'validator/es/lib/isURL';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '@/components/modules/Header';
import {
  nextStep,
  setStepLoading,
  setStepError,
  resetStepper,
} from '@/store/slice/stepperSlice';
import { socket } from '@/socket/socket.js';
import { fetchImage } from '@/utils/fetchImage.js';
import { ImagePreview } from '@/components/elements/ImagePreview/ImagePreview';
import { Footer } from '@/components/modules/Footer';
import { Faq } from '@/components/modules/Faq';
import { DownloadMenu } from '@/components/modules/DownloadMenu';
import { StepProgress } from '@/components/elements/StepProgress';
import {
  IMG_ACCEPT,
  MAX_FILES,
  MIME_TYPE_ACCEPT,
} from '@/constants/constants.js';

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
  const [detectedResult, setDetectedResult] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('detect-finished', async (data) => {
      // Result step
      dispatch(nextStep());
      dispatch(setStepLoading({ step: 2 }));
      try {
        const { idFolder, detection } = data;
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
        dispatch(nextStep());
        setFiles(fileData);
        setDetectedResult(detection);
        setIsDetecting(false);
        setDetected(true);

        socket.emit('delete-folder', { idFolder });
      } catch (err) {
        // Set error for Result step
        dispatch(setStepError({ step: 2 }));
        setError('Service is unavailable. Please try again later.');
        setIsDetecting(false);
      }
    });

    socket.on('detect-status', (data) => {
      const { status, msg } = data;

      if (status === 'error') {
        setError(msg);
        setIsDetecting(false);
        // Set error for Detect step
        dispatch(setStepError({ step: 1 }));
      }
    });

    return () => {
      socket.off('detect-finished');
      socket.off('detect-status');
    };
  }, [dispatch]);

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

    let detectedClasses = '';
    let isNoDetection = false;
    if (detected) {
      detectedClasses = detectedResult.find(({ fileName }) => {
        // NOTE: Detected result file name may be different from uploaded file
        // name when YOLOv5 save file to directory
        const resultFileStem = fileName.split('.').slice(0, -1).join('.');
        const imgFileStem = file.name.split('.').slice(0, -1).join('.');
        return resultFileStem === imgFileStem;
      })?.imgClass;

      isNoDetection = detectedClasses.includes('(no detections)');
    }
    return (
      <Stack key={index}>
        {detected && (
          <Alert
            color={isNoDetection ? 'red' : 'green'}
            icon={
              <Icon
                icon={
                  isNoDetection
                    ? 'ic:outline-error-outline'
                    : 'ic:outline-check-circle-outline'
                }
                width={24}
              />
            }
            title="Result"
          >
            {detectedClasses}
          </Alert>
        )}
        <ImagePreview
          caption={file.name}
          onDownloadClick={() => handleDownloadImageClick(index)}
          onRemoveClick={() => handleRemoveImageClick(index)}
          src={imageSrc}
        />
      </Stack>
    );
  });

  const handleReject = (rejectedFiles) => {
    if (rejectedFiles.length > MAX_FILES)
      setError(
        `Maximum file count exceeded. Please select less than ${MAX_FILES} files.`,
      );
  };

  const handleDrop = (selectedFiles) => {
    // NOTE: Have to set the value here because react-hook-form can't get files
    // from the Dropzone component

    const newFiles = selectedFiles.map((file) => {
      return {
        name: file.name,
        data: file,
      };
    });

    setValue('data-image', newFiles);
    setFiles(newFiles);
    // Reset initial state
    setDetected(false);
    dispatch(resetStepper());
  };

  const onSubmit = async (data) => {
    // Submit step
    dispatch(setStepLoading({ step: 0 }));

    const formData = new FormData();
    const fileImages = [...data['data-image']];
    // Filter out empty string
    const dataURLs = data['data-url'].split('\n').filter((url) => url);
    let fileURLs = [];
    try {
      fileURLs = await Promise.all(
        dataURLs.map(async (url, index) => {
          try {
            const fileData = await fetchImage(url);
            return fileData;
          } catch (err) {
            if (err instanceof Error) {
              throw Error(`Line ${index + 1}: ${err.message}`);
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

    // NOTE: Filter out undefined or null, not really necessary because we
    // already throw error
    const validFileURLs = fileURLs.filter((file) => file);
    fileURLs
      .map((file) => file.name) // Get array of file names
      .forEach((fileName, index, arr) => {
        if (arr.indexOf(fileName) !== index) {
          // NOTE: Rename file to avoid duplicate name
          const ext = fileName.split('.').pop();
          const stem = fileName.split('.').slice(0, -1).join('.');

          // Assign new name to file
          validFileURLs[index] = {
            ...validFileURLs[index],
            name: `${stem}_${uuidv4()}.${ext}`,
          };
        }
      });

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
      // Detect step
      dispatch(nextStep());
      dispatch(setStepLoading({ step: 1 }));
    } catch (err) {
      // Set error for Submit step
      dispatch(setStepError({ step: 0 }));
      setError('Service is unavailable. Please try again later.');
      setIsDetecting(false);
    }
  };

  return (
    <AppShell
      footer={
        <AppShellFooter className="static">
          <Footer />
        </AppShellFooter>
      }
      header={
        <AppShellHeader
          className="flex items-center justify-end"
          height={48}
          p={24}
        >
          <Header />
        </AppShellHeader>
      }
    >
      <Center>
        <Stack align="center">
          <Title className="text-5xl">
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
          <Text size="lg">
            Detect up to{' '}
            <Text color="red" size="xl" span weight={700}>
              36
            </Text>{' '}
            traffic signs
          </Text>
        </Stack>
      </Center>
      <Space h="xl" />
      <Stack align="center" className="my-10">
        <StepProgress />
        {error && (
          <Alert
            color="red"
            icon={<Icon icon="ic:outline-error-outline" width={24} />}
            title="Error"
          >
            {error}
          </Alert>
        )}
      </Stack>
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
              <Code color="rose" key={index}>
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
      <Stack align="center">
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
          className="w-full"
          cols={MAX_FILES}
          mt={previews ? 'xl' : 0}
          spacing="xl"
        >
          {previews}
        </SimpleGrid>
      </Stack>
      <Faq />
    </AppShell>
  );
};

export { HomePage };
