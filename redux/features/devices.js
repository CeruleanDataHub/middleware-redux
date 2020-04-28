import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invokeRequest } from './request.js';

export const getAllDevices = createAsyncThunk(
    'devices/get',
    async (_, thunk) => {
        const { payload: { body } } = await thunk.dispatch(invokeRequest({ method: 'get', url: '/api/edge/all' }));
        return { body };
    }
);

export const devicesSlice = createSlice({
    name: 'devices',
    initialState: {
        devices: {}
    },
    extraReducers: {
        [getAllDevices.fulfilled]: (state, action) => {
            state.devices['all'] = action.payload.body;
        }
    },
});

export const { saveDevices } = devicesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDevices = (state, hierarchyId) => state.devices[hierarchyId];

export default devicesSlice.reducer;
