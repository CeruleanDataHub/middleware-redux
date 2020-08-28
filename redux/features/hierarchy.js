import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';
import dispatchThunk from '../utils.js';

export const getAllHierarchies = createAsyncThunk(
  'hierarchy/get',
  async (_, thunk) =>
    await dispatchThunk(thunk, invokeRequest({ method: 'get', url: '/hierarchy/all' }))
);

export const getHierarchyTree = createAsyncThunk(
  'hierarchy/tree',
  async (_, thunk) =>
    await dispatchThunk(thunk, invokeRequest({ method: 'get', url: '/hierarchy/tree' }))
);

export const findHierarchies = createAsyncThunk(
  'hierarchy/find',
  async (data, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'post', url: '/hierarchy/find-where', data: data })
    )
);

export const addHierarchy = createAsyncThunk(
  'hierarchy/add',
  async (data, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({ method: 'post', url: '/hierarchy/', data: data })
    )
);

export const deleteHierarchy = createAsyncThunk(
  'hierarchy/delete',
  async (id, thunk) =>
    await dispatchThunk(thunk, invokeRequest({ method: 'delete', url: `/hierarchy/${id}` }))
);

export const editHierarchy = createAsyncThunk(
  'hierarchy/update',
  async (hierarchy, thunk) =>
    await dispatchThunk(
      thunk,
      invokeRequest({
        method: 'put',
        url: `/hierarchy/${hierarchy.id}`,
        data: { name: hierarchy.name },
      })
    )
);

export const setHierarchyTree = createAction('hierarchy/set');

export const hierarchiesSlice = createSlice({
  name: 'hierarchies',
  initialState: { error: undefined },
  extraReducers: {
    [getAllHierarchies.fulfilled]: (state, action) => {
      state.all = action.payload.body;
    },
    [getHierarchyTree.fulfilled]: (state, action) => {
      state.tree = action.payload.body;
    },
    [findHierarchies.fulfilled]: (state, action) => {
      state.hierarchies = action.payload.body;
    },
    [findHierarchies.pending]: (state) => {
      state.hierarchies = null;
    },
    [findHierarchies.rejected]: (state) => {
      state.hierarchies = null;
    },
    [deleteHierarchy.rejected]: (state, action) => {
      return action;
    },
    [setHierarchyTree]: (state, action) => {
      state.tree = action.payload;
    },
  },
});

export default hierarchiesSlice.reducer;
