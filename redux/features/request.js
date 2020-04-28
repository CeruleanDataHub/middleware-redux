import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import superagent from 'superagent';

const makeKey = request => {
    return JSON.stringify(request);
}

const makeUrl = (settings, url) => `${settings.API_URL}${url}`;

const createRequest = (method, url, subscriptionKey, query, data, options) => {
    const request = superagent[method](url);

    // Set query parameters.
    if (query !== undefined) {
        request.query(query);
    }

    // Set subscription key if given.
    if (subscriptionKey !== undefined) {
        request.set('Ocp-Apim-Subscription-Key', subscriptionKey);
    }

    // Send form data encoded as JSON if available.
    if (data !== undefined) {
        request.type('json');
        request.send(data);
    }

    // Check if response type should be set to blob. Note that request type is always JSON and caller cannot change it.
    if (options !== undefined && options.isBlob === true) {
        request.responseType('blob');
    }

    return request;
}

export const invokeRequest = createAsyncThunk(
    'request/invoke',
    async (options, thunk) => {
        const { method, url } = options;
        const key = makeKey(options);
        const APIurl = makeUrl(thunk.extra.settingsProvider, url);
        const request = await createRequest(method, APIurl);
     
        const { body, error } = request;
        
        return { key, body, error };
    }
);

export const requestSlice = createSlice({
    name: 'requests',
    initialState: {
        onGoingRequests: {},
        requestsCache: {},
        requestFail: {}
    },
    extraReducers: {
        [invokeRequest.pending]: (state, action) => {
            state.onGoingRequests[action.meta.requestId] = action.meta.arg;
        },
        [invokeRequest.fulfilled]: (state, action) => {
            delete state.onGoingRequests[action.meta.requestId];
            state.requestsCache[action.payload.key] = action.payload.body;
        },
        [invokeRequest.rejected]: (state, action) => {
            delete state.onGoingRequests[action.meta.requestId];
            state.requestFail[action.payload.key] = action.payload.error;
        },
    },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectOnGoingRequest = (state, key) => state.onGoingRequests[key];
export const selectCachedRequest = (state, key) => state.requestsCache[key];

export default requestSlice.reducer;
