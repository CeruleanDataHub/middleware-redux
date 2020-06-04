import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const postTelemetryQuery = createAsyncThunk('telemetry/telemetry-query', async (data, thunk) => {
  return await dispatchThunk(thunk, invokeRequest({ method: 'post', url: `/telemetry/telemetry-query`, data: data }));
});

export const latestTelemetry = createAsyncThunk('telemetry/telemetry-latest', async (data, thunk) => {
  return await dispatchThunk(thunk, invokeRequest({ method: 'post', url: `/telemetry/telemetry-latest`, data: data }));
});

export const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState: { error: undefined },
  extraReducers: {
    [postTelemetryQuery.fulfilled]: (state, action) => {
      state.all = action.payload.body;
    },
    [latestTelemetry.fulfilled]: (state, action) => {
      state.latest = action.payload.body;
    },
  },
});

export default telemetrySlice.reducer;
