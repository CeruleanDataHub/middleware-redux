import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getLastMonthKPIData = createAsyncThunk('identity-event/user-activity/last', async (data, thunk) => {
  return await dispatchThunk(
    thunk,
    invokeRequest({ method: 'post', url: '/identity-event/user-activity', data: data })
  );
});

export const getCurrentMonthKPIData = createAsyncThunk('identity-event/user-activity/current', async (data, thunk) => {
  return await dispatchThunk(
    thunk,
    invokeRequest({ method: 'post', url: '/identity-event/user-activity', data: data })
  );
});

export const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState: { error: undefined },
  extraReducers: {
    [getLastMonthKPIData.fulfilled]: (state, action) => {
      state.lastMonthKPIData = action.payload.body;
    },
    [getCurrentMonthKPIData.fulfilled]: (state, action) => {
      state.currentMonthKPIData = action.payload.body;
    },
  },
});

export default userActivitySlice.reducer;
