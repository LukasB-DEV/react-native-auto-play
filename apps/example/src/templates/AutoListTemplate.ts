import { ListTemplate, TextPlaceholders } from '@g4rb4g3/react-native-autoplay';
import { AutoTemplate } from './AutoTemplate';

const getTemplate = (): ListTemplate => {
  const template = new ListTemplate({
    id: 'list',
    title: {
      text: `${TextPlaceholders.Distance} ${TextPlaceholders.Duration}`,
      distance: { unit: 'meters', value: 1234 },
      duration: 4711,
    },
    actions: AutoTemplate.actions,
    sections: [
      {
        type: 'default',
        title: 'section text',
        items: [
          {
            type: 'default',
            title: { text: 'row #1' },
            browsable: true,
            image: {
              name: 'rotate_auto',
            },
            onPress: () => {
              const radioTemplate = new ListTemplate({
                id: 'radios',
                title: { text: 'radios' },
                actions: AutoTemplate.actions,
                sections: {
                  type: 'radio',
                  selectedIndex: 1,
                  items: [
                    {
                      type: 'radio',
                      title: { text: 'radio #1' },
                      onPress: () => {
                        console.log('*** radio #1');
                      },
                    },
                    {
                      type: 'radio',
                      title: { text: 'radio #2' },
                      onPress: () => {
                        console.log('*** radio #2');
                      },
                    },
                    {
                      type: 'radio',
                      title: { text: 'radio #3' },
                      onPress: () => {
                        console.log('*** radio #3');
                      },
                    },
                  ],
                },
                onDidDisappear: () => radioTemplate.destroy(),
              });
              radioTemplate.push().catch((e) => console.log('*** error radio template', e));
            },
          },
          {
            type: 'toggle',
            title: { text: 'row #2' },
            checked: true,
            image: {
              name: 'alarm',
            },
            onPress: (checked) => {
              console.log('*** toggle', checked);
            },
          },
          {
            type: 'toggle',
            title: { text: 'row #3' },
            checked: false,
            image: {
              name: 'bomb',
            },
            onPress: (checked) => {
              console.log('*** toggle', checked);
            },
          },
        ],
      },
    ],
    onDidDisappear: () => {
      template.destroy();
    },
  });

  return template;
};

export const AutoListTemplate = { getTemplate };
