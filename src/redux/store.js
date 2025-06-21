import { configureStore } from '@reduxjs/toolkit';
import apartmentReducer from './slice/apartmentSlice.js';
import customerReducer from './slice/customerSlice.js'
import planReducer from './slice/planSlice.js'
import vehicleReducer from './slice/vehicleSlice.js'
import subscriptionReducer from './slice/subscriptionSlice.js'
import washLogReducer from './slice/washLogSlice.js'

export const store = configureStore({
  reducer: {
    apartment: apartmentReducer,
    customer: customerReducer,
    plan: planReducer,
    vehicle: vehicleReducer,
    subscription: subscriptionReducer,
    washLog: washLogReducer,
  },
});
