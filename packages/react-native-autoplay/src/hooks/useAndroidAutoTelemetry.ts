import { useEffect, useState } from 'react';
import { type Permission, PermissionsAndroid } from 'react-native';
import { HybridAutoPlay } from '..';
import type { AndroidAutoPermissions, Telemetry } from '../types/Telemetry';

interface Props {
  /**
   * Can be used to delay asking for permissions if set to false. True by default.
   * Can be used to request other permissions first, so the permission request dialogs do not overlap.
   * @default true
   */
  requestTelemetryPermissions?: boolean;
  /**
   * The permissions to check.
   */
  requiredPermissions: Array<AndroidAutoPermissions>;
}

/**
 * Hook to check if the telemetry permissions are granted. If the permissions are not granted, it will request them from the user.
 *
 * @namespace Android
 * @param requestTelemetryPermissions If true, the telemetry permissions will be requested from the user. Can be set to false initially, in case other permissions need to be requested first, so the permission request dialogs do not overlap.
 * @returns true if the telemetry permissions are granted, false otherwise.
 */
export const useAndroidAutoTelemetry = ({
  requestTelemetryPermissions = true,
  requiredPermissions,
}: Props) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);

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
      HybridAutoPlay.registerAndroidAutoTelemetryListener((tlm: Telemetry) => {
        setTelemetry(tlm);
      }).catch(() => {});

      return () => {
        HybridAutoPlay.stopAndroidAutoTelemetry();
      };
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
    return;
  }, [permissionsGranted, requestTelemetryPermissions, requiredPermissions]);

  return { permissionsGranted, telemetry };
};
