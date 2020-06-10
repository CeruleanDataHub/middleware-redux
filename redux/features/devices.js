import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getAllDevices = createAsyncThunk(
  'devices/get',
  async (_, thunk) => await dispatchThunk(thunk, invokeRequest({ method: 'get', url: '/device/all' }))
);

export const findDevices = createAsyncThunk(
  'devices/find',
  async (data, thunk) => await dispatchThunk(thunk, invokeRequest({ method: 'post', url: '/device/find-where', data: data }))
);

export const getTwin = createAsyncThunk(
  'twin/get',
  async (id, thunk) => await dispatchThunk(thunk, invokeRequest({ method: 'get', url: `/twin/${id}` }))
);

export const updateTwin = createAsyncThunk(
  'twin/update',
  async (data, thunk) => await dispatchThunk(thunk, invokeRequest({ method: 'post', url: `/twin/update`, data: data }))
);

export const devicesSlice = createSlice({
  name: 'devices',
  initialState: { error: undefined },
  extraReducers: {
    [getAllDevices.fulfilled]: (state, action) => {
      state.all = action.payload.body;
    },
    [getTwin.fulfilled]: (state, action) => {
      state.twin = action.payload.body;
    },
    [findDevices.fulfilled]: (state, action) => {
      state.devices = action.payload.body
    },
    [findDevices.rejected]: (state, action) => {
      state.devices = null
    }
  },
});

export const { saveDevices } = devicesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDevices = (state, hierarchyId) => state.devices[hierarchyId];

export default devicesSlice.reducer;
