import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getLatestIdenties = createAsyncThunk(
  'identity-events/latest',
  async (_, thunk) => await dispatchThunk(thunk, invokeRequest({ method: 'get', url: '/identity-event/latest' }))
);

export const identityEventsSlice = createSlice({
    name: 'identity-events',
    initialState: { error: undefined },
    extraReducers: {
      [getLatestIdenties.fulfilled]: (state, action) => {
        state.latest = action.payload.body;
      },
      [getLatestIdenties.rejected]: (state, action) => {
        state.latest = null
      },
    },
  });

  export default identityEventsSlice.reducer;
