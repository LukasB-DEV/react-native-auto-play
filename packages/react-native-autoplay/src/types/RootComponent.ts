export type WindowInformation = {
  width: number;
  height: number;
  scale: number;
};

export type RootComponentInitialProps = {
  /**
   * AutoPlayRoot for the main app on the head unit
   * AutoPlayDashboard for the CarPlay dashboard (iOS only)
   * or a random uuid for cluster displays
   */
  id: 'AutoPlayRoot' | 'AutoPlayDashboard' | string;
  /**
   * react-native rootTag
   */
  rootTag: number;
  /**
   * this is the initial color scheme, use CarPlay.registerOnAppearanceDidChange to get updates on changes
   */
  colorScheme: 'dark' | 'light';
  window: WindowInformation;
};
