import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import API from '../../utils/axios';
import { formatDate } from '../../utils/getMonth';

export const fetchWashLogByApartment = createAsyncThunk(
    'washLog/fetchWashLogApartment',
    async ({id, startDate, endDate}, { rejectWithValue }) => {
        try {
            const res = await API.get(`washlog/apartment/${id}`,{
                params:{
                    startDate,
                    endDate
                }
            });
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
    async ({ postBody, startDate, endDate }, { dispatch, rejectWithValue }) => {
      try {
        await API.post('washlog', postBody);
        dispatch(fetchWashLogByApartment({ id: postBody.apartmentId, startDate: formatDate(startDate), endDate: formatDate(endDate)  }));
        toast.success('Wash Added');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Add failed');
        dispatch(fetchWashLogByApartment({ id: postBody.apartmentId, startDate: formatDate(startDate), endDate: formatDate(endDate)  }));
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
    async ({ postBody, startDate, endDate }, { dispatch, rejectWithValue }) => {
        try {
            await API.delete(`washlog/${postBody._id}`, postBody);
            dispatch(fetchWashLogByApartment({ id: postBody.apartmentId, startDate: formatDate(startDate), endDate: formatDate(endDate)  }));
            toast.success('Wash Log Deleted');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Delete failed');
            dispatch(fetchWashLogByApartment({ id: postBody.apartmentId, startDate: formatDate(startDate), endDate: formatDate(endDate)  }));
            return rejectWithValue('Delete failed');
        }
    }
);