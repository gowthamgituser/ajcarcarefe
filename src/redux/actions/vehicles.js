import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchVehicles = createAsyncThunk(
    'vehicles/fetchvehicles',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`vehicles/customer/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  
  export const deleteVehicles = createAsyncThunk(
    'vehicles/deleteVehicles',
    async ({id, customerId}, { dispatch, rejectWithValue }) => {
      try {
        await API.delete(`vehicles/${id}`);
        dispatch(fetchVehicles(customerId));
        toast.success('vehicle deleted');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Delete failed');
        dispatch(fetchVehicles(customerId));
        return rejectWithValue('Delete failed');
        
      }
    }
  );
  

export const addVehicles = createAsyncThunk(
    'vehicles/addvehicles',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('vehicles', payload);
            dispatch(fetchVehicles(payload.customerId));
            toast.success('vehicle added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchVehicles(payload.customerId));
            return rejectWithValue('Add failed');
        }
    }
  );


export const updateVehicles = createAsyncThunk(
    'vehicles/updateVehicles',
    async ({payload, id}, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`vehicles/${id}`, payload);
            dispatch(fetchVehicles(payload.customerId));
            toast.success('vehicle updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchVehicles(payload.customerId));
            return rejectWithValue('Add failed');
        }
    }
  );