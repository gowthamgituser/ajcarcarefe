import { configureStore } from '@reduxjs/toolkit';
import apartmentReducer from './slice/apartmentSlice.js';
import customerReducer from './slice/customerSlice.js'
import planReducer from './slice/planSlice.js'

export const store = configureStore({
  reducer: {
    apartment: apartmentReducer,
    customer: customerReducer,
    plan: planReducer,
  },
});
