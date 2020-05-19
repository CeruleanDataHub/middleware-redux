import { getDefaultMiddleware } from '@reduxjs/toolkit';
export { default as devicesReducer, getAllDevices, getTwin, updateTwin } from './redux/features/devices.js';
export { Auth0SessionProvider } from './redux/providers/auth0SessionProvider.js';

export default function(settingsProvider, cacheProvider, sessionProvider) {
    return getDefaultMiddleware({
        thunk: {
            extraArgument: {
                settingsProvider,
                cacheProvider,
                sessionProvider
            }
        }
    });
}
