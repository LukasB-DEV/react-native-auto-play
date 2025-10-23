import {
  type AndroidAutoPermissions,
  AndroidAutoTelemetryPermissions,
  type CleanupCallback,
  HybridAutoPlay,
  useAndroidAutoTelemetry,
} from '@g4rb4g3/react-native-autoplay';
import { useEffect, useState } from 'react';
import { Button, StatusBar, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AutoTrip } from './config/AutoTrip';
import { actionStartNavigation, actionStopNavigation } from './state/navigationSlice';
import { useAppDispatch, useAppSelector } from './state/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const { Speed, Energy, Odometer } = AndroidAutoTelemetryPermissions;
const ANDROID_AUTO_PERMISSIONS: Array<AndroidAutoPermissions> = [Speed, Energy, Odometer];

/*const ANDROID_AUTOMOTIVE_PERMISSIONS: Array<AndroidAutoPermissions> = [
  AndroidAutomotiveTelemetryPermissions.Energy,
  AndroidAutomotiveTelemetryPermissions.Info,
  AndroidAutomotiveTelemetryPermissions.ExteriorEnvironment,
  AndroidAutomotiveTelemetryPermissions.EnergyPorts,
  AndroidAutomotiveTelemetryPermissions.Speed,
];*/

function AppContent() {
  const dispatch = useAppDispatch();

  const isNavigating = useAppSelector((state) => state.navigation.isNavigating);
  const selectedTrip = useAppSelector((state) => state.navigation.selectedTrip);

  const [isConnected, setIsConnected] = useState(false);
  const [isRootVisible, setIsRootVisible] = useState(false);

  useEffect(() => {
    const listeners: Array<CleanupCallback> = [];

    listeners.push(HybridAutoPlay.addListener('didConnect', () => setIsConnected(true)));
    listeners.push(HybridAutoPlay.addListener('didDisconnect', () => setIsConnected(false)));
    listeners.push(
      HybridAutoPlay.addListenerRenderState('AutoPlayRoot', (state) =>
        setIsRootVisible(state === 'didAppear')
      )
    );

    return () => {
      for (const remove of listeners) {
        remove();
      }
    };
  }, []);

  const { permissionsGranted, telemetry } = useAndroidAutoTelemetry({
    requiredPermissions: ANDROID_AUTO_PERMISSIONS,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text>AutoPlay connected: {String(isConnected)}</Text>
      <Text>Head unit root visible: {String(isRootVisible)}</Text>
      <Text>isNavigating: {String(isNavigating)}</Text>
      <Text>selectedTrip: {JSON.stringify(selectedTrip)}</Text>
      <Text>telemetry permissions granted: {String(permissionsGranted)}</Text>
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
      {isNavigating ? (
        <Button
          title="stop navigation"
          onPress={() => {
            dispatch(actionStopNavigation());
          }}
        />
      ) : (
        <Button
          title="start navigation"
          onPress={() => {
            dispatch(
              actionStartNavigation({
                tripId: AutoTrip[0].id,
                routeId: AutoTrip[0].routeChoices[0].id,
              })
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
