import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchSubscription = createAsyncThunk(
    'subscription/fetchSubscription',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`subscription/customer/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );

  export const fetchSubscriptionByVehicle = createAsyncThunk(
    'subscription/fetchSubscriptionByVehicle',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`subscription/vehicle/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  
  export const deleteSubscription = createAsyncThunk(
    'subscription/deleteSubscription',
    async ({id, customerId}, { dispatch, rejectWithValue }) => {
      try {
        await API.delete(`subscription/${id}`);
        dispatch(fetchSubscription(customerId));
        toast.success('subscription deleted');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Delete failed');
        dispatch(fetchSubscription(customerId));
        return rejectWithValue('Delete failed');
        
      }
    }
  );
  

export const addSubscription = createAsyncThunk(
    'subscription/addSubscription',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('subscription', payload);
            dispatch(fetchSubscription(payload.customerId));
            toast.success('subscription added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchSubscription(payload.customerId));
            return rejectWithValue('Add failed');
        }
    }
  );


export const updateSubscription = createAsyncThunk(
    'subscription/updateSubscription',
    async ({payload,id}, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`subscription/${id}`, payload);
            dispatch(fetchSubscription(payload.customerId));
            toast.success('subscription updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchSubscription(payload.customerId));
            return rejectWithValue('Add failed');
        }
    }
  );