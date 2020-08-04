import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getLatestIdentities = createAsyncThunk(
  'identity-events/latest',
  async (_, thunk) =>
    await dispatchThunk(thunk, invokeRequest({ method: 'get', url: '/identity-event/latest', prefixKey: 'API_PREFIX' }))
);

export const identityEventsSlice = createSlice({
  name: 'identity-events',
  initialState: { error: undefined },
  extraReducers: {
    [getLatestIdentities.fulfilled]: (state, action) => {
      state.latest = action.payload.body;
    },
    [getLatestIdentities.rejected]: (state, action) => {
      state.latest = null;
    },
  },
});

export default identityEventsSlice.reducer;
