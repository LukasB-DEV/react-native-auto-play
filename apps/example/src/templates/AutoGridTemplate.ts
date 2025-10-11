import { GridTemplate } from '@g4rb4g3/react-native-autoplay';
import { AutoTemplate } from './AutoTemplate';

const getTemplate = (): GridTemplate => {
  return new GridTemplate({
    id: 'gridTemplate',
    title: { text: 'grid' },
    actions: AutoTemplate.actions,
    buttons: [
      {
        title: { text: '#1' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #1');
        },
      },
      {
        title: { text: '#2' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #2');
        },
      },
      {
        title: { text: '#3' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #3');
        },
      },
      {
        title: { text: '#4' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #4');
        },
      },
      {
        title: { text: '#5' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #5');
        },
      },
      {
        title: { text: '#6' },
        image: {
          name: 'star',
          size: 26,
        },
        onPress: () => {
          console.log('grid #6');
        },
      },
    ],
  });
};

export const AutoGridTemplate = { getTemplate };
