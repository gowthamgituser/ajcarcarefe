// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchCustomer } from '../actions/customers';

// Slice
const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default customerSlice.reducer;
