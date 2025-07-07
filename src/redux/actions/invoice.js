import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/axios';
import { toast } from 'react-toastify';

export const fetchInvoice = createAsyncThunk(
    'invoice/fetchInvoice',
    async ({id, month, year}, { rejectWithValue }) => {
      try {
        const res = await API.get(`invoice/apartment/${id}`, {
            params: {
                month,
                year
            },
        });
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  

  export const fetchPaymentStatus = createAsyncThunk(
    'invoice/fetchPaymentStatus',
    async ({ customerId, month, year, apartmentId }, { rejectWithValue }) => {
      try {
        const res = await API.get(`invoice/payment-status/${customerId}`, {
          params: {
            month,
            year,
            apartmentId,
          },
        });
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );

  export const updatePayment = createAsyncThunk(
    'invoice/fetchPaymentStatus',
    async ({payload}, { dispatch, rejectWithValue }) => {
      try {
        await API.put(`invoice/payment-status/${payload.customerId}`, payload);
        dispatch(fetchInvoice({id: payload.apartmentId}));
        toast.success('Payment updated successfully');
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  export const fetchCustomerInvoice = createAsyncThunk(
    'invoice/fetchCustomerInvoice',
    async ({id, month, year}, { rejectWithValue }) => {
      try {
        const res = await API.get(`invoice/customer/${id}`, {
            params: {
                month,
                year
            },
        });
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  