// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchApartments, getApartment } from '../actions/apartment';
import { toast } from 'react-toastify';

// Slice
const apartmentSlice = createSlice({
  name: 'apartment',
  initialState: {
    list: [],
    loading: false,
    error: null,
    apartmentData: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.apartmentData = action.payload;
      })
      .addCase(getApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default apartmentSlice.reducer;
