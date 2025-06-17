import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchCustomer = createAsyncThunk(
    'customer/fetchCustomer',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`customers/apartment/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  
  export const deleteCustomer = createAsyncThunk(
    'customer/deleteCustomer',
    async (id, { dispatch, rejectWithValue }) => {
      try {
        await API.delete(`customers/${id}`);
        dispatch(fetchCustomer());
        toast.success('Customer deleted');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Delete failed');
        dispatch(fetchCustomer());
        return rejectWithValue('Delete failed');
        
      }
    }
  );
  

export const addCustomer = createAsyncThunk(
    'customer/addCustomer',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('customers', payload);
            dispatch(fetchCustomer(payload.apartmentId));
            toast.success('Customer added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchCustomer(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
  );


export const updateCustomer = createAsyncThunk(
    'customer/updateCustomer',
    async ({payload, id}, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`customers/${id}`, payload);
            dispatch(fetchCustomer(payload.apartmentId));
            toast.success('Customer updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchCustomer(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
  );