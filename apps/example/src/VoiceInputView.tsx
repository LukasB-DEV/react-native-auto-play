import { useVoiceInput } from '@iternio/react-native-auto-play';
import { Text } from 'react-native';

export function VoiceInputView() {
  const { voiceInputResult } = useVoiceInput();

  if (!voiceInputResult) {
    return null;
  }

  return (
    <Text>{`Voice input coordinates: ${voiceInputResult.coordinates}, query: ${voiceInputResult.query}`}</Text>
  );
}
