import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from '../hooks/useSafeAreaInsets';

export const SafeAreaView = (props: ViewProps) => {
  const { style, ...rest } = props;
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        style,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingRight: safeAreaInsets.right,
          paddingLeft: safeAreaInsets.left,
        },
      ]}
      {...rest}
    />
  );
};
