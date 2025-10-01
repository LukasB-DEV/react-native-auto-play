import { AutoPlay } from '@g4rb4g3/react-native-autoplay';
import { MapTemplate } from '@g4rb4g3/react-native-autoplay/lib/templates/MapTemplate';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const AutoPlayRoot = (props) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setI((p) => p + 1), 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text>Hello Nitro CarPlay {i}</Text>
    </View>
  );
};

const registerRunnable = () => {
  console.log('[CP] registerRunnable');
  const onConnect = () => {
    console.log('[CP] connected');
    const template = new MapTemplate({ component: AutoPlayRoot, id: 'AutoPlayRoot' });
    template.setRootTemplate();
  };

  const onDisconnect = () => {};

  AutoPlay.addListener('didConnect', onConnect);
  AutoPlay.addListener('didDisconnect', onDisconnect);
};

export default registerRunnable;
