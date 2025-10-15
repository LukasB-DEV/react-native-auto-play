import { AppRegistry, Platform, type Task, type TaskProvider } from 'react-native';
import { HybridAutoPlay } from '.';

const taskProvider: TaskProvider = (): Task => () =>
  new Promise((resolve) => {
    const remove = HybridAutoPlay.addListener('didDisconnect', () => {
      resolve();
      remove();
    });
  });

const registerHeadlessTask = () => {
  if (Platform.OS !== 'android') {
    return;
  }
  AppRegistry.registerHeadlessTask('AndroidAutoHeadlessJsTask', taskProvider);
};

export default { registerHeadlessTask };
