import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeStep: 0,
  steps: [
    {
      // Submit
      loading: false,
      error: false,
    },
    {
      // Detect
      loading: false,
      error: false,
    },
    {
      // Result
      loading: false,
      error: false,
    },
  ],
};
const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    nextStep(state, action) {
      if (state.activeStep < 3) {
        state.activeStep += 1;
        if (state.activeStep > 0) {
          state.steps[state.activeStep - 1].loading = false;
        }
      }
    },

    setStepLoading(state, action) {
      const { step } = action.payload;
      state.steps[step].loading = true;
    },

    setStepError(state, action) {
      const { step } = action.payload;
      state.activeStep += 1;
      state.steps[step].loading = false;
      state.steps[step].error = true;
    },

    resetStepper(state, action) {
      state.activeStep = 0;
      state.steps.forEach((step) => {
        step.loading = false;
        step.error = false;
      });
    },
  },
});

export const { nextStep, setStepLoading, setStepError, resetStepper } =
  stepperSlice.actions;

export default stepperSlice.reducer;
