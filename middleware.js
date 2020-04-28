import { getDefaultMiddleware } from '@reduxjs/toolkit';

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
