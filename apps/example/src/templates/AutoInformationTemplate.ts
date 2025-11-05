import {
  InformationTemplate,
  type InformationTemplateConfig,
  TextPlaceholders,
} from '@g4rb4g3/react-native-autoplay';
import { Platform } from 'react-native';
import { AutoTemplate } from './AutoTemplate';

const defaultColor =
  Platform.OS === 'android' ? 'white' : { lightColor: 'black', darkColor: 'white' };

const getTemplate = (props?: {
  mapConfig?: InformationTemplateConfig['mapConfig'];
}): InformationTemplate => {
  return new InformationTemplate({
    title: {
      text: `${TextPlaceholders.Distance} - ${TextPlaceholders.Duration}`,
      distance: { unit: 'meters', value: 1234 },
      duration: 4711,
    },
    mapConfig: props?.mapConfig,
    headerActions: AutoTemplate.headerActions,
    section: {
      type: 'default',
      items: [
        {
          type: 'text',
          title: {
            text: `${TextPlaceholders.Distance} - ${TextPlaceholders.Duration}`,
            distance: { unit: 'meters', value: 1234 },
            duration: 4711,
          },
          detailedText: {
            text: `${TextPlaceholders.Distance} - ${TextPlaceholders.Duration}`,
            distance: { unit: 'meters', value: 1234 },
            duration: 4711,
          },
          image: { name: 'text_ad', color: defaultColor },
        },
        {
          type: 'text',
          title: { text: 'Title 2' },
          detailedText: { text: 'Text2' },
          image: { name: 'text_ad', color: defaultColor },
        },
        {
          type: 'text',
          title: { text: 'Title 3\nwith 2 rows\nCan i add one more? - oh no it truncates me :(' },
          detailedText: {
            text: [
              'some longer text',
              'with two rows',
              'do three work?',
              'oh yes they do!',
              'and another one? - nope, this one is cut off',
            ].join('\n'),
          },
          image: { name: 'text_ad', color: defaultColor },
        },
      ],
    },
    actions: [
      Platform.OS === 'android'
        ? {
            type: 'textImage',
            image: { name: 'alarm' },
            title: 'Text',
            style: 'destructive',
            onPress: () => {
              console.log('*** Action 1');
            },
          }
        : {
            type: 'image',
            image: { name: 'alarm' },
            style: 'destructive',
            onPress: () => {
              console.log('*** Action 1');
            },
          },
      {
        type: 'text',
        title: 'Text',
        style: 'default',
        onPress: () => {
          console.log('*** Action 2');
        },
      },
    ],
    onPopped: () => console.log('InformationTemplate onPopped'),
  });
};

export const AutoInformationTemplate = { getTemplate };
