import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchApartments = createAsyncThunk(
    'apartment/fetchApartments',
    async (_, { rejectWithValue }) => {
      try {
        const res = await API.get('apartments');
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );

  export const getApartment = createAsyncThunk(
    'apartment/getApartments',
    async (id, { rejectWithValue }) => {
      try {
        const res = await API.get(`apartments/${id}`);
        return res.data;
      } catch (error) {
        const message =
          error.response?.data?.error || error.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );
  
  export const deleteApartment = createAsyncThunk(
    'apartment/deleteApartment',
    async (id, { dispatch, rejectWithValue }) => {
      try {
        await API.delete(`apartments/${id}`);
        dispatch(fetchApartments());
        toast.success('Apartment deleted');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Delete failed');
        dispatch(fetchApartments());
        return rejectWithValue('Delete failed');
        
      }
    }
  );
  

export const addApartment = createAsyncThunk(
    'apartment/addApartment',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('apartments', payload);
            dispatch(fetchApartments());
            toast.success('Apartment added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchApartments());
            return rejectWithValue('Add failed');
        }
    }
  );


export const updateApartment = createAsyncThunk(
    'apartment/updateApartment',
    async ({payload, id}, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`apartments/${id}`, payload);
            dispatch(fetchApartments());
            toast.success('Apartment added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchApartments());
            return rejectWithValue('Add failed');
        }
    }
  );