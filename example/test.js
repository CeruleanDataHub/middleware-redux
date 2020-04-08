import dispatch from 'redux';
import invokeRequest from './redux/features/request.mjs';
import store from './redux/store.mjs';

dispatch(invokeRequest('key'));
console.log(store.getState());
