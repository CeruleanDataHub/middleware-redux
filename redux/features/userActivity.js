import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getLastMonthUsersKPIData = createAsyncThunk('identity-event/user-activity/last', async (data, thunk) => {
  return await dispatchThunk(
    thunk,
    invokeRequest({ method: 'post', url: '/identity-event/user-activity', data: data })
  );
});

export const getCurrentMonthUsersKPIData = createAsyncThunk(
  'identity-event/user-activity/current',
  async (data, thunk) => {
    return await dispatchThunk(
      thunk,
      invokeRequest({ method: 'post', url: '/identity-event/user-activity', data: data })
    );
  }
);

export const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState: { error: undefined },
  extraReducers: {
    [getLastMonthUsersKPIData.fulfilled]: (state, action) => {
      state.lastMonthKPIData = action.payload.body;
    },
    [getCurrentMonthUsersKPIData.fulfilled]: (state, action) => {
      state.currentMonthKPIData = action.payload.body;
    },
  },
});

export default userActivitySlice.reducer;
