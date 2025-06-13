import { configureStore } from '@reduxjs/toolkit';
import apartmentReducer from './slice/apartmentSlice.js';

export const store = configureStore({
  reducer: {
    apartment: apartmentReducer,
  },
});
