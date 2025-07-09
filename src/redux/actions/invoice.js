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
  
  export const downloadCustomerInvoice = createAsyncThunk(
    'invoice/downloadCustomerInvoice',
    async (id , { rejectWithValue }) => {
      try {
        const response = await API.get(`invoice/pdf/${id}`, {
          responseType: 'blob', 
        });
  

        const blob = new Blob([response.data], { type: 'application/pdf' });
  
    
        const url = window.URL.createObjectURL(blob);
  
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Invoice downloaded');
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  