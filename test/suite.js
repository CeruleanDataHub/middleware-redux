import { expect } from 'chai';
import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import denimMiddleware from '../middleware.js';

import requestReducer from '../redux/features/request.js';
import devicesReducer, {
  getAllDevices,
  getTwin,
  findDevices,
  updateTwin
} from '../redux/features/devices.js';
import hierarchiesReducer, {
  getAllHierarchies,
  getHierarchyTree,
  findHierarchies,
  addHierarchy,
  editHierarchy,
  deleteHierarchy
} from '../redux/features/hierarchy.js';

import superagent from 'superagent';
import { Auth0SessionProvider } from '../redux/providers/auth0SessionProvider.js';

require('dotenv').config();

const settingsProvider = {
  API_URL: process.env.API_BASE_URL,
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();
sessionProvider.setTenant(process.env.AUTH0_TENANT);

const createStore = () =>
  configureStore({
    reducer: {
      requests: requestReducer,
      devices: devicesReducer,
      hierarchies: hierarchiesReducer,
    },
    middleware: [...denimMiddleware(settingsProvider, cacheProvider, sessionProvider), logger],
  });

describe('Devices', () => {
  before(() => {
    return initAuth0Token(sessionProvider);
  });

  it('should get all devices', async function () {
    this.enableTimeouts(false);

    const store = createStore();
    const response = await store.dispatch(getAllDevices());

    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().devices.all).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().devices.all);
  });

  it('should find devices by query', async function() {

    const store = createStore();

    const query = {
      select: [ "id", "name", "type"],
      where: {
        type: "node"
      }
    }
    const response = await store.dispatch(findDevices(query));

    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().devices.devices).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().devices.devices);
  });

  it('should return empty list when no devices found', async function() {
    const store = createStore();

    const query = {
      select: [ "id", "name", "type"],
      where: {
        name: "doesNotExist"
      }
    }
    const response = await store.dispatch(findDevices(query));

    expect(response.payload.body).to.eql([]);
    expect(response.payload.error).to.be.null;
    expect(store.getState().devices.devices).to.eql([]);
  });

  it('should get twin', async function () {
    this.enableTimeouts(false);

    const store = createStore();
    const response = await store.dispatch(getTwin('c5:4c:cb:2d:b0:f5'));

    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().devices.twin).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().devices.twin);
  });

  it('should return error on 404 when getting twin', async function () {
    const store = createStore();
    const response = await store.dispatch(getTwin('invalid'));

    expect(response.payload.error).to.equal('Not Found');
    expect(response.payload.body).to.be.null;
    expect(store.getState().twin).to.be.undefined;
  });

  it('should return error on network errors when getting twin', async function () {
    const invalidSettingsProvider = {
      API_URL: 'http://invalid:2121',
    };
    const storeWithInvalidSettings = configureStore({
      reducer: {
        requests: requestReducer,
        devices: devicesReducer,
      },
      middleware: [...denimMiddleware(invalidSettingsProvider, cacheProvider, sessionProvider), logger],
    });
    const response = await storeWithInvalidSettings.dispatch(getTwin('c5:4c:cb:2d:b0:f5'));

    expect(response.payload.error).to.not.be.empty;
    expect(response.payload.body).to.be.null;
    expect(storeWithInvalidSettings.getState().twin).to.be.undefined;
  });

  it('should update twins desired properties', async function() {
    const store = createStore();

    const deviceId = 'c5:4c:cb:2d:b0:f5';

    const twin1 = {
      id: deviceId,
      state: {
        properties: {
          desired: {
            testProperty: 'added in test'
          }
        }
      }
    }

    await store.dispatch(updateTwin(twin1));

    const response = await store.dispatch(getTwin(deviceId));

    expect(response.payload.body.properties.desired.testProperty).to.equal('added in test');

    const twin2 = {
      id: deviceId,
      state: {
        properties: {
          desired: {
            testProperty: null
          }
        }
      }
    }

    await store.dispatch(updateTwin(twin2));

    const response2 = await store.dispatch(getTwin(deviceId));
    
    expect(response2.payload.body.properties.desired.testProperty).to.be.undefined;
  });
});

describe('Hierarchy', () => {
  before(() => {
    return initAuth0Token(sessionProvider);
  });

  it('should get all hierarchies', async function () {
    this.enableTimeouts(false);

    const store = createStore();
    const response = await store.dispatch(getAllHierarchies());
    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().hierarchies.all).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().hierarchies.all);
    expect(Array.isArray(response.payload.body)).to.be.true;
  });

  it('should get tree hierarchies', async function () {
    this.enableTimeouts(false);

    const store = createStore();
    const response = await store.dispatch(getHierarchyTree());
    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().hierarchies.tree).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().hierarchies.tree);
    expect(Array.isArray(response.payload.body)).to.be.true;
    expect(response.payload.body.length).to.equal(1);
  });

  it('should find hierarchies by query', async function() {

    const store = createStore();

    const query = {
      select: [ "id", "name"],
      where: { id: "2" }
    }
    const response = await store.dispatch(findHierarchies(query));

    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.error).to.be.null;
    expect(store.getState().hierarchies.hierarchies).not.to.be.empty;
    expect(response.payload.body).to.equal(store.getState().hierarchies.hierarchies);
  });

  it('should return empty list when no hierarchies found', async function() {
    const store = createStore();

    const query = {
      select: [ "id", "name" ],
      where: {
        name: "doesNotExist"
      }
    }
    const response = await store.dispatch(findHierarchies(query));

    expect(response.payload.body).to.eql([]);
    expect(response.payload.error).to.be.null;
    expect(store.getState().hierarchies.hierarchies).to.eql([]);
  });

  it('should return error on network errors', async function () {
    const invalidSettingsProvider = {
      API_URL: 'http://invalid:2121',
    };
    const storeWithInvalidSettings = configureStore({
      reducer: {
        requests: requestReducer,
        hierarchies: hierarchiesReducer,
      },
      middleware: [...denimMiddleware(invalidSettingsProvider, cacheProvider, sessionProvider), logger],
    });
    const response = await storeWithInvalidSettings.dispatch(getAllHierarchies());

    expect(response.payload.error).to.not.be.empty;
    expect(response.payload.body).to.be.null;
    expect(storeWithInvalidSettings.getState().twin).to.be.undefined;
  });

  it('should insert new hierarchy', async function() {
    const store = createStore();

    const testHierarchy = {
      parent_id: 1,
      name: 'inserted in test',
      type: 'test'
    }

    const response = await store.dispatch(addHierarchy(testHierarchy));

    expect(response.payload.body).not.to.be.empty;
    expect(response.payload.body.name).to.equal(testHierarchy.name);
  });

  it('should update hierarchy', async function() {
    const store = createStore();

    const response = await store.dispatch(findHierarchies({ type: 'test' }));
    const testHierarchy = response.payload.body[0];

    expect(testHierarchy.name).to.equal('inserted in test');

    await store.dispatch(editHierarchy({ 
      id: testHierarchy.id, 
      name: 'updated in test'
    }));

    const response2 = await store.dispatch(findHierarchies({ id: testHierarchy.id }));
    const updatedTestHierarchy = response2.payload.body[0];

    expect(updatedTestHierarchy.name).to.equal('updated in test');
  });
  
  // Deletes all 'test' type hierarchies
  it('should delete hierarchy', async function() {
    const store = createStore();

    const response = await store.dispatch(findHierarchies({
      type: 'test'
    }));

    expect(response.payload.body).not.to.be.empty;

    const testHierarchies = response.payload.body;

    const deletePromises = testHierarchies.map((h) => {
      return store.dispatch(deleteHierarchy(h.id));
    });

    await Promise.all(deletePromises);

    const response2 = await store.dispatch(findHierarchies({
      type: 'test'
    }));

    expect(response2.payload.body).to.be.empty;
  });

});

const initAuth0Token = (sessionProvider) => {
  return new Promise((resolve, reject) => {
    superagent
      .agent()
      .post(process.env.AUTH0_OAUTH_TOKEN_URL)
      .set('Content-Type', 'application/json')
      .send({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
      })
      .end(function (error, result) {
        if (error) {
          reject('Error getting auth0 token');
        } else {
          const auth0_token = JSON.parse(result.text).access_token;
          sessionProvider.setToken(auth0_token);
          resolve();
        }
      });
  });
};
