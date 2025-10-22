import type { Permission } from 'react-native/types';

export type AndroidAutoPermissions =
  | Permission
  | 'com.google.android.gms.permission.CAR_FUEL'
  | 'com.google.android.gms.permission.CAR_SPEED'
  | 'com.google.android.gms.permission.CAR_MILEAGE'
  | 'android.car.permission.CAR_ENERGY'
  | 'android.car.permission.CAR_INFO'
  | 'android.car.permission.CAR_EXTERIOR_ENVIRONMENT'
  | 'android.car.permission.CAR_ENERGY_PORTS'
  | 'android.car.permission.CAR_SPEED';

export type PermissionRequestResult = { granted: Array<string>; denied: Array<string> } | null;

type NumericTelemetryItem = {
  /**
   * timestamp in seconds when the value was received on native side
   */
  timestamp: number;
  value: number;
};

type StringTelemetryItem = {
  /**
   * timestamp in seconds when the value was received on native side
   */
  timestamp: number;
  value: string;
};

type VehicleTelemetryItem = {
  name?: StringTelemetryItem;
  year?: NumericTelemetryItem;
  manufacturer?: StringTelemetryItem;
};

export type Telemetry = {
  speed?: NumericTelemetryItem;
  fuelLevel?: NumericTelemetryItem;
  batteryLevel?: NumericTelemetryItem;
  range?: NumericTelemetryItem;
  odometer?: NumericTelemetryItem;
  vehicle?: VehicleTelemetryItem;
};
