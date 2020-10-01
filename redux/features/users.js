import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import dispatchThunk, { getUsersOutputMapper } from '../utils.js';
import { invokeRequest } from './request.js';

export const getUsers = createAsyncThunk(
  'users/get',
  async (_, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'get', url: '/auth0/users' })
    )
);

export const getRolesForUser = createAsyncThunk(
  'user/roles-get',
  async (id, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'get', url: `/auth0/users/${id}/roles` })
    )
);

export const addRoleToUser = createAsyncThunk(
  'user/roles-add',
  async ({ id, data }, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'post', url: `/auth0/users/${id}/roles`, data })
    )
);

export const removeRoleFromUser = createAsyncThunk(
  'user/roles-delete',
  async ({ id, data }, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'delete', url: `/auth0/users/${id}/roles`, data })
    )
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'delete', url: `/auth0/users/${id}` })
    )
);

export const updateUserBlockStatus = createAsyncThunk(
  'user/block',
  async ({ id, blockStatus }, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'patch',
        url: `/auth0/users/${id}`,
        data: blockStatus,
      })
    )
);

export const getPermissionsForUser = createAsyncThunk(
  'user/permissions-get',
  async (id, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'get', url: `/auth0/users/${id}/permissions` })
    )
);

export const usersSlice = createSlice({
  name: 'roles',
  initialState: { error: undefined },
  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      state.all = getUsersOutputMapper(action.payload.body);
    },
    [getRolesForUser.fulfilled]: (state, action) => {
      state.roles = action.payload.body;
    },
    [getPermissionsForUser.fulfilled]: (state, action) => {
      state.permissions = action.payload.body;
    },
  },
});

export default usersSlice.reducer;
