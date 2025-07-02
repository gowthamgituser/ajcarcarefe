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
            toast.success('Wash Added');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Add failed');
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            return rejectWithValue('Add failed');
        }
    }
);

export const editWashLog = createAsyncThunk(
    'washLog/editWashLog',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.put(`washlog/${payload._id}`, payload);
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            toast.success('Wash Edited');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Edit failed');
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            return rejectWithValue('Edit failed');
        }
    }
);

export const deleteWashLog = createAsyncThunk(
    'washLog/deleteWashLog',
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            await API.delete(`washlog/${payload._id}`, payload);
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            toast.success('Wash Log Deleted');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Delete failed');
            dispatch(fetchWashLogByApartment(payload.apartmentId));
            return rejectWithValue('Delete failed');
        }
    }
);