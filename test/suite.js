import { expect } from 'chai';
import _ from 'lodash';
import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import denimMiddleware from '../middleware.js';

import requestReducer from '../redux/features/request.js';
import devicesReducer, { getAllDevices } from '../redux/features/devices.js';

const settingsProvider = {
    API_URL: 'https://iot-platform-db-api.azurewebsites.net'
};
const cacheProvider = {};

const createStore = () =>
     configureStore({
        reducer: {
            requests: requestReducer,
            devices: devicesReducer
        },
        middleware: [...denimMiddleware(settingsProvider, cacheProvider), logger]
    });


describe('Devices', () => {

    it('should get all devices', async function() {
        this.enableTimeouts(false);

        const store = createStore();
        const response = await store.dispatch(getAllDevices());

        expect(!_.isEmpty(response.payload.body));
        expect(!_.isEmpty(store.getState().devices.devices.all));
        expect(_.isEqual(response.payload.body, store.getState().devices.devices.all));
    });

});


