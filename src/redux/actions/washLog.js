import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

export const fetchWashLogByApartment = createAsyncThunk(
    'washLog/fetchWashLogApartment',
    async (id, { rejectWithValue }) => {
        try {
            const res = await API.get(`washlog/apartment/${id}`);
            return res.data;
        } catch (error) {
            const message =
                error.response?.data?.error || error.message || 'Something went wrong';
            return rejectWithValue(message);
        }
    }
);

export const addWashLog = createAsyncThunk(
    'washLog/addWashLog',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.post('washlog', payload);
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            toast.success('subscription added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
);
