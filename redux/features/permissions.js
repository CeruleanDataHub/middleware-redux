import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dispatchThunk from '../utils.js';
import { invokeRequest } from './request.js';

export const getAllPermissions = createAsyncThunk(
  'permissions/get',
  async (id, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'get',
        url: `/auth0/resource-servers/${id}`,
      })
    )
);

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: { error: undefined },
  extraReducers: {
    [getAllPermissions.fulfilled]: (state, action) => {
      state.all = action.payload.body.scopes;
    },
  },
});

export default permissionsSlice.reducer;
