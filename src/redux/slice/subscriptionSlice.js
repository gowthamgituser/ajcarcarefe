// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchSubscription, fetchSubscriptionByApartment, fetchSubscriptionByVehicle } from '../actions/subscription';

// Slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    list: [],
    list_subscription_vehicle: [],
    loading: false,
    error: null,
    list_subscription_apartment: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchSubscriptionByVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionByVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.list_subscription_vehicle = action.payload;
      })
      .addCase(fetchSubscriptionByVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchSubscriptionByApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionByApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.list_subscription_apartment = action.payload;
      })
      .addCase(fetchSubscriptionByApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default subscriptionSlice.reducer;
