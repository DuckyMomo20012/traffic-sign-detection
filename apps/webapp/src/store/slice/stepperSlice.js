import { createSlice } from '@reduxjs/toolkit';

const MAX_STEP = 3;

// Step 0: Submit
// Step 1: Detect
// Step 2: Result

const initialState = {
  activeStep: 0,
  steps: Array(MAX_STEP).fill({
    loading: false,
    error: false,
  }),
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    nextStep(state, action) {
      if (state.activeStep < MAX_STEP) {
        state.activeStep += 1;
        if (state.activeStep > 0) {
          state.steps[state.activeStep - 1].loading = false;
        }
      }
    },

    setStepLoading(state, action) {
      const { step } = action.payload;

      // NOTE: We don't set loading state if there is error, to prevent "error"
      // was set before "loading" state
      if (state.steps[step] && !state.steps[step].error) {
        state.steps[step].loading = true;
      }
    },

    setStepError(state, action) {
      const { step } = action.payload;

      // NOTE: Clear loading state if there is error
      if (state.steps[step]) {
        state.steps[step].loading = false;
        state.steps[step].error = true;
      }
    },

    resetSteps(state, action) {
      state.activeStep = 0;
      state.steps.forEach((step) => {
        step.loading = false;
        step.error = false;
      });
    },
  },
});

export const { nextStep, setStepLoading, setStepError, resetSteps } =
  stepperSlice.actions;

export default stepperSlice.reducer;
