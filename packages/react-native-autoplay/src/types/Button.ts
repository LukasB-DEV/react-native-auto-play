import type { GlyphName } from './Glyphmap';

export type ButtonType = 'appIcon' | 'back' | 'pan' | 'custom';
export type MapButtonType = 'pan' | 'custom';

export type Button = {
  type: ButtonType;
  onPress: () => void;
};

export type ButtonImage = {
  name: GlyphName;
  size?: number;
  /**
   * sets the icon color, currently Android does not allow colors and converts everything to grayscale so we stick to white for this
   * @summary defaults to white if not specified
   * @namespace iOS
   */
  color?: string;
  /**
   * sets the background color, currently Android does not allow colors and converts everything to grayscale so we stick to transparent for this
   * @summary defaults to transparent if not specified
   * @namespace iOS
   */
  backgroundColor?: string;
};

export interface MapButton extends Button {
  type: MapButtonType;
  image: ButtonImage;
}
