export type ButtonType = 'appIcon' | 'back' | 'pan' | 'custom';

export type Button = {
  type: ButtonType;
  onPress: () => void;
};
