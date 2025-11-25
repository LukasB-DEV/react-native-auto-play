import { useEffect, useState } from 'react';
import { HybridAutoPlay } from '..';

export const useVoiceInput = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [voiceInputResult, setVoiceInputResult] = useState<
    { coordinates: { lat: number; lon: number } | undefined; query: string | undefined } | undefined
  >();

  useEffect(() => {
    const removeDidConnect = HybridAutoPlay.addListener('didConnect', () => setIsConnected(true));
    const removeDidDisconnect = HybridAutoPlay.addListener('didDisconnect', () =>
      setIsConnected(false)
    );

    setIsConnected(HybridAutoPlay.isConnected());

    return () => {
      removeDidConnect();
      removeDidDisconnect();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const remove = HybridAutoPlay.addListenerVoiceInput((coordinates, query) => {
      console.log('*** voiceInput', coordinates, query);
      if (coordinates || query) {
        setVoiceInputResult({ coordinates, query });
      } else {
        setVoiceInputResult(undefined);
      }
    });

    return () => {
      remove();
    };
  }, [isConnected]);

  return { voiceInputResult };
};
