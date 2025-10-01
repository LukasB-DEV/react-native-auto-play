const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = mergeConfig(defaultConfig, {
  watchFolders: [
    path.resolve(__dirname, '../../packages/react-native-autoplay'),
    path.resolve(__dirname, '../../node_modules'),
  ],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [path.resolve(__dirname, '../../node_modules')],
    blockList: ['../../packages/react-native-autoplay/node_modules'],
  },
});

module.exports = config;
