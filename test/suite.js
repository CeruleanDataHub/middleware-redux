import { expect } from 'chai';
import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import denimMiddleware from '../middleware.js';

import requestReducer from '../redux/features/request.js';
import devicesReducer, { getAllDevices, getTwin } from '../redux/features/devices.js';
import superagent from 'superagent';
import { Auth0SessionProvider } from '../redux/providers/auth0SessionProvider.js';

require('dotenv').config();

const settingsProvider = {
    API_URL: process.env.API_BASE_URL
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();

const createStore = () =>
     configureStore({
        reducer: {
            requests: requestReducer,
            devices: devicesReducer
        },
        middleware: [...denimMiddleware(settingsProvider, cacheProvider, sessionProvider), logger]
    });

describe('Devices', () => {

    before(() => {
        return initAuth0Token(sessionProvider);
    });

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

        expect(response.payload.error).to.equal("Not Found");
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
            middleware: [...denimMiddleware(invalidSettingsProvider, cacheProvider, sessionProvider), logger]
        });
        const response = await storeWithInvalidSettings.dispatch(getTwin("c5:4c:cb:2d:b0:f5"));

        expect(response.payload.error).to.not.be.empty;
        expect(response.payload.body).to.be.null;
        expect(storeWithInvalidSettings.getState().twin).to.be.undefined;
    });
});

const initAuth0Token = (sessionProvider) => {
    return new Promise((resolve, reject) => {
        superagent.agent()
          .post(process.env.AUTH0_OAUTH_TOKEN_URL)
          .set("Content-Type", "application/json")
          .send({
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: "client_credentials"
          })
          .end(function (error, result) {
              if (error) {
                  reject("Error getting auth0 token")
              } else {
                  const auth0_token = JSON.parse(result.text).access_token;
                  sessionProvider.setToken(auth0_token);
                  resolve();
              }
          });
    });
}