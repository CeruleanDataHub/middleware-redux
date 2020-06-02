import { configureStore } from '@reduxjs/toolkit';
import requestReducer from './features/request.js';

export default configureStore({
  reducer: {
    request: requestReducer,
  },
});
