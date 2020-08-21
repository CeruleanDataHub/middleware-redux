import { getDefaultMiddleware } from '@reduxjs/toolkit';

export {
  default as devicesReducer,
  getAllDevices,
  findDevices,
  getTwin,
  updateTwin,
  getLastMonthDevicesKPIData,
  getCurrentMonthDevicesKPIData,
} from './redux/features/devices.js';

export {
  default as hierarchyReducer,
  getAllHierarchies,
  getHierarchyTree,
  addHierarchy,
  deleteHierarchy,
  setHierarchyTree,
  editHierarchy,
  findHierarchies,
} from './redux/features/hierarchy.js';

export {
  default as telemetryReducer,
  telemetryQuery,
  aggregateTelemetryQuery,
} from './redux/features/telemetry.js';

export {
  default as identityEventReducer,
  getLatestIdentities,
} from './redux/features/identityEvent.js';

export {
  default as activityReducer,
  getLastMonthUsersKPIData,
  getCurrentMonthUsersKPIData,
  getMaxUserLoginCountInADay,
} from './redux/features/userActivity.js';

export {
  default as rolesReducer,
  getAllRoles,
  createRole,
  deleteRole,
  getPermissionsForRole,
  updatePermissionsForRole,
  deletePermissionFromRole,
} from './redux/features/roles.js';

export {
  default as permissionsReducer,
  getAllPermissions,
} from './redux/features/permissions.js';

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
