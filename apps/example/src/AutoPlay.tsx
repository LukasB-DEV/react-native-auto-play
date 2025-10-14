import {
  type Alert,
  AutoPlay,
  MapTemplate,
  type RootComponentInitialProps,
  SafeAreaView,
} from '@g4rb4g3/react-native-autoplay';
import { useEffect, useState } from 'react';
import { Platform, Text } from 'react-native';
import { AutoGridTemplate } from './templates/AutoGridTemplate';
import { AutoListTemplate } from './templates/AutoListTemplate';

const AutoPlayRoot = (props: RootComponentInitialProps) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setI((p) => p + 1), 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'green',
      }}
    >
      <Text>
        Hello Nitro {Platform.OS} {i}
      </Text>
      <Text>{JSON.stringify(props.window)}</Text>
      <Text>Running as {props.id}</Text>
    </SafeAreaView>
  );
};

let alertTimer: ReturnType<typeof setInterval> | null = null;

const alert = (remaining: number): Alert => ({
  durationMs: 10000,
  id: 1,
  title: {
    text: `alert ${remaining}ms`,
  },
  subtitle: {
    text: 'danger',
  },
  image: {
    name: 'alarm',
  },
  primaryAction: {
    title: 'keep calm',
    onPress: () => {
      console.log('keep calm');
      if (alertTimer != null) {
        clearInterval(alertTimer);
      }
    },
    style: 'default',
  },
  secondaryAction: {
    title: 'run',
    onPress: () => {
      console.log('run');
      if (alertTimer != null) {
        clearInterval(alertTimer);
      }
    },
    style: 'destructive',
  },
  onWillShow: () => console.log('alarm alert showing....'),
  onDidDismiss: (reason) => console.log('alarm alert dismissed', reason),
});

const registerRunnable = () => {
  const onConnect = () => {
    const rootTemplate = new MapTemplate({
      component: AutoPlayRoot,
      id: 'AutoPlayRoot',
      onWillAppear: () => console.log('onWillAppear'),
      onDidAppear: () => console.log('onDidAppear'),
      onWillDisappear: () => console.log('onWillDisappear'),
      onDidDisappear: () => console.log('onDidDisappear'),
      onDidUpdatePanGestureWithTranslation: ({ x, y }) => {
        console.log('*** onDidUpdatePanGestureWithTranslation', x, y);
      },
      onDidUpdateZoomGestureWithCenter: ({ x, y }, scale) => {
        console.log('*** onDidUpdateZoomGestureWithCenter', x, y, scale);
      },
      onClick: ({ x, y }) => console.log('*** onClick', x, y),
      onDoubleClick: ({ x, y }) => console.log('*** onDoubleClick', x, y),
      onAppearanceDidChange: (colorScheme) => console.log('*** onAppearanceDidChange', colorScheme),
      actions: {
        android: [
          {
            type: 'image',
            image: { name: 'grid_3x3' },
            onPress: (t) => {
              console.log('***', t.id);
              AutoGridTemplate.getTemplate().push();
            },
          },
          {
            type: 'image',
            image: {
              name: 'list',
            },
            onPress: () => AutoListTemplate.getTemplate().push(),
          },
        ],
        ios: {
          leadingNavigationBarButtons: [
            {
              type: 'image',
              image: { name: 'grid_3x3' },
              onPress: () => AutoGridTemplate.getTemplate().push(),
            },
          ],
          trailingNavigationBarButtons: [
            {
              type: 'image',
              image: {
                name: 'list',
              },
              onPress: () => AutoListTemplate.getTemplate().push(),
            },
          ],
        },
      },
      mapButtons: [
        {
          type: 'custom',
          image: {
            name: 'ev_station',
            color: 'rgba(255, 255, 255, 1)',
            backgroundColor: 'rgba(66, 66, 66, 0.5)',
          },
          onPress: (template) => {
            var remaining = 10000;
            alertTimer = setInterval(() => {
              remaining -= 1000;
              if (remaining > 0) {
                template.showAlert(alert(remaining));
                return;
              }
              if (alertTimer != null) {
                clearInterval(alertTimer);
              }
            }, 1000);
            template.showAlert(alert(remaining));
          },
        },
      ],
    });
    rootTemplate.setRootTemplate();
  };

  const onDisconnect = () => {
    // template.destroy();
  };

  AutoPlay.addListener('didConnect', onConnect);
  AutoPlay.addListener('didDisconnect', onDisconnect);
};

export default registerRunnable;
