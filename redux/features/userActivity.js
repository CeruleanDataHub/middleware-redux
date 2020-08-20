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

export const getMaxUserLoginCountInADay = createAsyncThunk(
  'identity-event/user-activity/max-user-login-count-in-a-day',
  async (_, thunk) => {
    return await dispatchThunk(
      thunk,
      invokeRequest({ method: 'get', url: '/identity-event/day-max-login-count' })
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
    [getMaxUserLoginCountInADay.fulfilled]: (state, action) => {
      state.maxUserLoginCountInADay = action.payload.body;
    },
  },
});

export default userActivitySlice.reducer;
