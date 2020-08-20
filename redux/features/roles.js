import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dispatchThunk from '../utils.js';
import { invokeRequest } from './request.js';

export const getAllRoles = createAsyncThunk(
  'roles/get',
  async (_, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'get',
        url: '/auth0/roles',
      })
    )
);

export const createRole = createAsyncThunk(
  'roles/create',
  async (data, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'post', url: '/auth0/roles', data })
    )
);

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: { error: undefined },
  extraReducers: {
    [getAllRoles.fulfilled]: (state, action) => {
      state.all = action.payload.body;
    },
  },
});

export default rolesSlice.reducer;
