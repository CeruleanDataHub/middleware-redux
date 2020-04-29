import { expect } from 'chai';
import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import denimMiddleware from '../middleware.js';

import requestReducer from '../redux/features/request.js';
import devicesReducer, { getAllDevices, getTwin } from '../redux/features/devices.js';

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

        expect(response.payload.body).not.to.be.empty;
        expect(response.payload.error).to.be.null;
        expect(store.getState().devices.all).not.to.be.empty;
        expect(response.payload.body).to.equal(store.getState().devices.all);
    });

    it('should get twin', async function() {
        this.enableTimeouts(false);

        const store = createStore();
        const response = await store.dispatch(getTwin("c5:4c:cb:2d:b0:f5"));

        expect(response.payload.body).not.to.be.empty;
        expect(response.payload.error).to.be.null;
        expect(store.getState().devices.twin).not.to.be.empty;
        expect(response.payload.body).to.equal(store.getState().devices.twin);
    });

    it('should return error on 404', async function() {
        const store = createStore();

        const response = await store.dispatch(getTwin("invalid"));
        expect(response.payload.error).to.not.be.empty;
        expect(response.payload.body).to.be.null;
        expect(store.getState().twin).to.be.undefined;
    });

    it('should return error on network errors', async function() {
        const invalidSettingsProvider = {
            API_URL: "http://invalid:2121"
        }
        const storeWithInvalidSettings = configureStore({
            reducer: {
                requests: requestReducer,
                devices: devicesReducer
            },
            middleware: [...denimMiddleware(invalidSettingsProvider, cacheProvider), logger]
        });

        const response = await storeWithInvalidSettings.dispatch(getTwin("c5:4c:cb:2d:b0:f5"));
        expect(response.payload.error).to.not.be.empty;
        expect(response.payload.body).to.be.null;
        expect(storeWithInvalidSettings.getState().twin).to.be.undefined;
    });
});
