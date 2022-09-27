import { Icon } from '@iconify/react';
import { Stepper } from '@mantine/core';
import { useSelector } from 'react-redux';

const StepProgress = () => {
  const activeStep = useSelector((state) => state.stepper.activeStep);
  const steps = useSelector((state) => state.stepper.steps);

  return (
    <Stepper active={activeStep} breakpoint="sm" className="w-2/3">
      <Stepper.Step
        allowStepClick={false}
        completedIcon={
          steps[0].error ? (
            <Icon icon="ic:outline-error-outline" width={24} />
          ) : (
            <Icon icon="ic:outline-check-circle-outline" width={24} />
          )
        }
        description="Submit images"
        label="Submit"
        loading={steps[0].loading}
      />
      <Stepper.Step
        allowStepClick={false}
        completedIcon={
          steps[1].error ? (
            <Icon icon="ic:outline-error-outline" width={24} />
          ) : (
            <Icon icon="ic:outline-check-circle-outline" width={24} />
          )
        }
        description="Detect traffic signs"
        label="Detect"
        loading={steps[1].loading}
      />
      <Stepper.Step
        allowStepClick={false}
        completedIcon={
          steps[2].error ? (
            <Icon icon="ic:outline-error-outline" width={24} />
          ) : (
            <Icon icon="ic:outline-check-circle-outline" width={24} />
          )
        }
        description="View result"
        label="Result"
        loading={steps[2].loading}
      />
    </Stepper>
  );
};

export { StepProgress };
