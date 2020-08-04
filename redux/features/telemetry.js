import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const telemetryQuery = createAsyncThunk('telemetry/telemetry-query', async (data, thunk) => {
  return await dispatchThunk(
    thunk,
    invokeRequest({ method: 'post', url: `/telemetry/query`, data: data, prefixKey: 'API_PREFIX' })
  );
});

export const aggregateTelemetryQuery = createAsyncThunk('telemetry/aggregate-telemetry-query', async (data, thunk) => {
  return await dispatchThunk(
    thunk,
    invokeRequest({ method: 'post', url: `/telemetry/query-aggregate`, data: data, prefixKey: 'API_PREFIX' })
  );
});

export const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState: { error: undefined },
  extraReducers: {
    [telemetryQuery.fulfilled]: (state, action) => {
      state.queryResult = action.payload.body;
    },
    [telemetryQuery.rejected]: (state, action) => {
      state.queryResult = null;
    },
    [aggregateTelemetryQuery.fulfilled]: (state, action) => {
      state.queryResult = action.payload.body;
    },
    [aggregateTelemetryQuery.rejected]: (state, action) => {
      state.queryResult = null;
    },
  },
});

export default telemetrySlice.reducer;
