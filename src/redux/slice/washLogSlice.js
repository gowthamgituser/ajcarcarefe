// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchWashLogByApartment } from '../actions/washLog';

// Slice
const washLogSlice = createSlice({
  name: 'washlog',
  initialState: {
    list_apartment: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchWashLogByApartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWashLogByApartment.fulfilled, (state, action) => {
        state.loading = false;
        state.list_apartment = action.payload;
      })
      .addCase(fetchWashLogByApartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default washLogSlice.reducer;
