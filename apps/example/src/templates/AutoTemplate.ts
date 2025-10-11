import { type Actions, AutoPlay, type BackButton } from '@g4rb4g3/react-native-autoplay';

const backButton: BackButton = {
  type: 'back',
  onPress: () => AutoPlay.popTemplate(),
};

const actions: Actions = {
  android: {
    startHeaderAction: backButton,
    endHeaderActions: [
      {
        type: 'textImage',
        image: { name: 'help' },
        title: 'help',
        onPress: () => {
          console.log('*** help \\o/');
        },
      },
      {
        type: 'image',
        image: { name: 'close' },
        onPress: () => AutoPlay.popToRootTemplate(),
      },
    ],
  },
  ios: {
    backButton,
    trailingNavigationBarButtons: [
      {
        type: 'text',
        title: 'help',
        onPress: () => {
          console.log('*** help \\o/');
        },
      },
      {
        type: 'image',
        image: { name: 'close' },
        onPress: () => AutoPlay.popToRootTemplate(),
      },
    ],
  },
};

export const AutoTemplate = { actions };
