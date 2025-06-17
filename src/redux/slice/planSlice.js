// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchplans } from '../actions/plans';

// Slice
const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchplans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchplans.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchplans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default plansSlice.reducer;
