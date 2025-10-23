import {
  type AndroidAutoPermissions,
  AndroidAutoTelemetryPermissions,
  type Telemetry,
} from '@g4rb4g3/react-native-autoplay';
import { Text } from 'react-native';

export const ANDROID_AUTO_PERMISSIONS: Array<AndroidAutoPermissions> = [
  AndroidAutoTelemetryPermissions.Speed,
  AndroidAutoTelemetryPermissions.Energy,
  AndroidAutoTelemetryPermissions.Odometer,
];

/*export const ANDROID_AUTOMOTIVE_PERMISSIONS: Array<AndroidAutoPermissions> = [
  AndroidAutomotiveTelemetryPermissions.Energy,
  AndroidAutomotiveTelemetryPermissions.Info,
  AndroidAutomotiveTelemetryPermissions.ExteriorEnvironment,
  AndroidAutomotiveTelemetryPermissions.EnergyPorts,
  AndroidAutomotiveTelemetryPermissions.Speed,
];*/

export function TelemetryView({ telemetry }: { telemetry: Telemetry | null }) {
  return (
    <>
      {telemetry ? <Text>---- last incoming tlm ----</Text> : null}
      {telemetry?.batteryLevel ? (
        <Text>
          batteryLevel: {telemetry.batteryLevel.value} ({telemetry.batteryLevel.timestamp})
        </Text>
      ) : null}
      {telemetry?.fuelLevel ? (
        <Text>
          fuelLevel: {telemetry.fuelLevel.value} ({telemetry.fuelLevel.timestamp})
        </Text>
      ) : null}
      {telemetry?.speed ? (
        <Text>
          speed: {telemetry.speed.value} ({telemetry.speed.timestamp})
        </Text>
      ) : null}
      {telemetry?.range ? (
        <Text>
          range: {telemetry.range.value} ({telemetry.range.timestamp})
        </Text>
      ) : null}
      {telemetry?.odometer ? (
        <Text>
          odometer: {telemetry.odometer.value} ({telemetry.odometer.timestamp})
        </Text>
      ) : null}
      {telemetry?.vehicle?.name ? (
        <Text>
          vehicle name: {telemetry.vehicle.name.value} ({telemetry.vehicle.name.timestamp})
        </Text>
      ) : null}
      {telemetry?.vehicle?.year ? (
        <Text>
          vehicle year: {telemetry.vehicle.year.value} ({telemetry.vehicle.year.timestamp})
        </Text>
      ) : null}
      {telemetry?.vehicle?.manufacturer ? (
        <Text>
          vehicle manufacturer: {telemetry.vehicle.manufacturer.value} (
          {telemetry.vehicle.manufacturer.timestamp})
        </Text>
      ) : null}
    </>
  );
}
