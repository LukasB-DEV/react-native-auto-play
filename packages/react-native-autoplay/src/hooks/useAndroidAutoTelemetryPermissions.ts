import { useEffect, useState } from 'react';
import { type Permission, PermissionsAndroid } from 'react-native';
import type { AndroidAutoPermissions } from '../types/Telemetry';

/**
 * Hook to check if the telemetry permissions are granted. If the permissions are not granted, it will request them from the user.
 *
 * @namespace Android
 * @param requestTelemetryPermissions If true, the telemetry permissions will be requested from the user. Can be set to false initially, in case other permissions need to be requested first, so the permission request dialogs do not overlap.
 * @returns true if the telemetry permissions are granted, false otherwise.
 */
export const useAndroidAutoTelemetryPermission = (
  requestTelemetryPermissions: boolean,
  requiredPermissions: Array<AndroidAutoPermissions>
) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const state = await Promise.all(
        requiredPermissions.map((permission) =>
          PermissionsAndroid.check(permission as Permission).catch(() => false)
        )
      );

      setPermissionsGranted(state.every((granted) => granted));
    };

    checkPermissions();
  }, [requiredPermissions]);

  useEffect(() => {
    if (permissionsGranted) {
      return;
    }

    if (requestTelemetryPermissions) {
      // PermissionsAndroid is not aware of automotive permissions
      PermissionsAndroid.requestMultiple(requiredPermissions as Array<Permission>)
        .then((value) => {
          const isGranted = requiredPermissions.every(
            (permission) => value[permission as Permission] === 'granted'
          );
          if (!isGranted) {
            console.warn('*** Android Auto telemetry permissions not granted');
            return;
          }
          setPermissionsGranted(true);
        })
        .catch((e) => console.error('*** Android Auto telemetry permissions error', e));
    }
  }, [permissionsGranted, requestTelemetryPermissions, requiredPermissions]);

  return permissionsGranted;
};
