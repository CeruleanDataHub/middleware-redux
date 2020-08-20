import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import superagent from 'superagent';

const makeKey = (request) => {
  return JSON.stringify(request);
};

const makeUrl = (settings, url) => {
  let requestUrl = settings.API_URL;

  if(!url.includes("/auth0/")){
    requestUrl += settings.API_ROOT + settings.API_VERSION
  }
  requestUrl += url

  return requestUrl;
}

const createRequest = (method, url, subscriptionKey, query, data, token, idToken, options, tenant) => {
  const request = superagent[method](url);
  // Set query parameters.
  if (query !== undefined) {
    request.query(query);
  }

  // Set token if given
  if (token !== undefined) {
    request.set('Authorization', `Bearer ${token}`);
  }
  if (idToken !== undefined) {
    request.set('x-cerulean-id', idToken);
  }
  if (tenant !== undefined) {
    request.set('x-cerulean-context', tenant);
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
};

export const invokeRequest = createAsyncThunk('request/invoke', async (options, thunk) => {
  const { method, url } = options;
  const key = makeKey(options);
  const APIurl = makeUrl(thunk.extra.settingsProvider, url);
  const token = thunk.extra.sessionProvider.getToken();
  const idToken = thunk.extra.sessionProvider.getIdToken();
  const tenant = thunk.extra.sessionProvider.getTenant();
  try {
    const response = await createRequest(method, APIurl, null, null, options.data, token, idToken, undefined, tenant);
    const { body, error } = response;
    return { key, body, error };
  } catch (err) {
    return thunk.rejectWithValue({ key, error: err.message });
  }
});

export const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    onGoingRequests: {},
    requestsCache: {},
    requestFail: {},
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
