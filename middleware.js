import { getDefaultMiddleware } from '@reduxjs/toolkit';
export { default as devicesReducer, getAllDevices, getTwin, updateTwin } from './redux/features/devices.js';
export {
  default as hierarchyReducer,
  getAllHierarchies,
  getHierarchyTree,
  addHierarchy,
  deleteHierarchy,
  setHierarchyTree,
  editHierarchy,
} from './redux/features/hierarchy.js';
export { Auth0SessionProvider } from './redux/providers/auth0SessionProvider.js';

export default function (settingsProvider, cacheProvider, sessionProvider) {
  return getDefaultMiddleware({
    thunk: {
      extraArgument: {
        settingsProvider,
        cacheProvider,
        sessionProvider,
      },
    },
  });
}
