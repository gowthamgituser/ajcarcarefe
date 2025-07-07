// src/redux/apartmentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchCustomerInvoice, fetchInvoice, fetchPaymentStatus } from '../actions/invoice';

// Slice
const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    list: [],
    customerInvoice: [],
    paymentStatus: [],
    loading: false,
    paymentStatusloading: false,
    customerInvoiceLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.paymentStatusloading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.paymentStatusloading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.paymentStatusloading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(fetchCustomerInvoice.pending, (state) => {
        state.customerInvoiceLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerInvoice.fulfilled, (state, action) => {
        state.customerInvoiceLoading = false;
        state.customerInvoice = action.payload;
      })
      .addCase(fetchCustomerInvoice.rejected, (state, action) => {
        state.customerInvoiceLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
  },
});

export default invoiceSlice.reducer;
