import { NitroModules } from 'react-native-nitro-modules';
import AutoPlayHeadlessJsTask from './AutoPlayHeadlessJsTask';
import type { HybridAutoPlay as NitroHybridAutoPlay } from './specs/HybridAutoPlay.nitro';

AutoPlayHeadlessJsTask.registerHeadlessTask();

export const HybridAutoPlay =
  NitroModules.createHybridObject<NitroHybridAutoPlay>('HybridAutoPlay');

export * from './components/SafeAreaView';
export * from './hooks/useAndroidAutoTelemetry';
export * from './hooks/useMapTemplate';
export * from './hooks/useSafeAreaInsets';
export * from './scenes/AutoPlayCluster';
export * from './scenes/CarPlayDashboardScene';
export * from './templates/GridTemplate';
export * from './templates/ListTemplate';
export * from './templates/MapTemplate';
export * from './templates/MessageTemplate';
export * from './templates/SearchTemplate';
export * from './templates/Template';
export * from './types/Button';
export * from './types/Event';
export * from './types/GestureEvents';
export * from './types/Image';
export * from './types/Maneuver';
export * from './types/RootComponent';
export * from './types/Telemetry';
export * from './types/Text';
export * from './types/Trip';
export type {
  NavigationAlert as Alert,
  NavigationAlertAction as AlertAction,
} from './utils/NitroAlert';
export type { GridButton } from './utils/NitroGrid';
