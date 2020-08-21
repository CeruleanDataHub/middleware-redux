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

export const getPermissionsForRole = createAsyncThunk(
  'role/permissions',
  async (id, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'get', url: `/auth0/roles/${id}/permissions` })
    )
);

export const updatePermissionsForRole = createAsyncThunk(
  'role/permissions-update',
  async ({ id, data }, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'post',
        url: `/auth0/roles/${id}/permissions`,
        data,
      })
    )
);

export const deletePermissionsForRole = createAsyncThunk(
  'role/permissions-update',
  async ({ id, data }, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'delete',
        url: `/auth0/roles/${id}/permissions`,
        data,
      })
    )
);

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: { error: undefined },
  extraReducers: {
    [getAllRoles.fulfilled]: (state, action) => {
      state.all = action.payload.body;
    },
    [getPermissionsForRole.pending]: (state, action) => {
      state.permissionsForActiveRole = null;
    },
    [getPermissionsForRole.fulfilled]: (state, action) => {
      state.permissionsForActiveRole = action.payload.body;
    },
  },
});

export default rolesSlice.reducer;
