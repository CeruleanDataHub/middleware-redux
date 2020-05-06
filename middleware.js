import { getDefaultMiddleware } from '@reduxjs/toolkit';
export { default as devicesReducer, getAllDevices, getTwin, updateTwin } from './redux/features/devices.js';

export default function(settingsProvider, cacheProvider) {
    return getDefaultMiddleware({
        thunk: {
            extraArgument: {
                settingsProvider,
                cacheProvider
            }
        }
    });
}
