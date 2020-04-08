import { createSlice } from '@reduxjs/toolkit';

export const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        onGoingRequests: {},
        requestsCache: {}
    },
    reducers: {
        startRequest: (state, key, request) => {
            state.onGoingRequests[key] = request;
        },
        successRequest: (state, key, payload) => {
            delete state.onGoingRequests[key];
            state.requestsCache[key] = payload;
        },
        failRequest: (state, key) => {
            delete state.onGoingRequests[key];
        },
  },
});

export const { startRequest, successRequest, failRequest } = requestSlice.actions;

export const invokeRequest = (key, request) => dispatch => {
    return dispatch(startRequest(key, request)).then((payload) => {
        return dispatch(successRequest(key, payload));
    }, () => {
        return dispatch(failRequest(key));
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOnGoingRequest = (state, key) => state.onGoingRequests[key];
export const selectCachedRequest = (state, key) => state.requestsCache[key];

export default requestSlice.reducer;
