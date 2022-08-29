import { configureStore } from '@reduxjs/toolkit';
import stepperReducer from './slice/stepperSlice.js';

export const store = configureStore({
  reducer: {
    stepper: stepperReducer,
  },
});
