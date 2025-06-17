import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchplans = createAsyncThunk(
    'plans/fetchplans',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`plans/apartment/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  
  export const deleteplans = createAsyncThunk(
    'plans/deleteplans',
    async (id, { dispatch, rejectWithValue }) => {
      try {
        await API.delete(`plans/${id}`);
        dispatch(fetchplans());
        toast.success('plans deleted');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Delete failed');
        dispatch(fetchplans());
        return rejectWithValue('Delete failed');
        
      }
    }
  );
  

export const addplans = createAsyncThunk(
    'plans/addplans',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('plans', payload);
            dispatch(fetchplans(payload.apartmentId));
            toast.success('plans added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchplans(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
  );


export const updateplans = createAsyncThunk(
    'plans/updateplans',
    async ({payload,id}, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`plans/${id}`, payload);
            dispatch(fetchplans(payload.apartmentId));
            toast.success('plans updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchplans(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
  );