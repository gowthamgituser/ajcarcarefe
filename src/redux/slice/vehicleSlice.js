// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchVehicles, fetchVehiclesByApartment } from '../actions/vehicles';

// Slice
const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    list: [],
    vehicle_apartmentList: [],
    loading: false,
    error: null,
    apartmentData: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchVehiclesByApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesByApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicle_apartmentList = action.payload;
      })
      .addCase(fetchVehiclesByApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default vehicleSlice.reducer;
