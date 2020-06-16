# iot-platform-middleware-redux

## Tests

Create .env file in the project root with the following content:

```
API_BASE_URL=https://ddh-api.azure-api.net/api/v1
AUTH0_OAUTH_TOKEN_URL=https://cerulean-data-hub.eu.auth0.com/oauth/token
AUTH0_CLIENT_ID=<Auth0 client ID>
AUTH0_CLIENT_SECRET=<Auth0 client secret>
AUTH0_AUDIENCE=https://ddh-api.azure-api.net
AUTH0_TENANT=<tenant:UUID of the root hierarchy>
```

The referenced Auth0 client has to have the 'client_credentials' grant type enabled and have sufficient permissions to access the API endpoints.

To run the tests, execute:

```
npm run test
```
