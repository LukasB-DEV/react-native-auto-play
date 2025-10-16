import type { TripConfig, TripPreviewTextConfiguration } from '@g4rb4g3/react-native-autoplay';

export const AutoTrip: Array<TripConfig> = [
  {
    id: '#0',
    routeChoices: [
      {
        id: '#0-0',
        summaryVariants: ['Fastest route'],
        additionalInformationVariants: ['Fastest route'],
        selectionSummaryVariants: ['1 charge stop'],
        steps: [
          {
            latitude: 0,
            longitude: 0,
            name: 'Your position',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now(),
                timezone: 'Europe/Vienna',
              },
              distanceRemaining: { value: 0, unit: 'meters' },
              timeRemaining: 0,
            },
          },
          {
            latitude: 0,
            longitude: 0,
            name: 'Charger',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now() + 2 * 3600000,
                timezone: 'Europe/Berlin',
              },
              distanceRemaining: { unit: 'kilometers', value: 200 },
              timeRemaining: 2 * 3600,
            },
          },
          {
            latitude: 0,
            longitude: 0,
            name: 'Dresden',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now() + 4.5 * 3600000,
                timezone: 'Europe/Berlin',
              },
              distanceRemaining: { unit: 'kilometers', value: 400 },
              timeRemaining: 4.5 * 3600,
            },
          },
        ],
      },
      {
        id: '#0-1',
        summaryVariants: ['Shortest route'],
        additionalInformationVariants: ['Shortest route'],
        selectionSummaryVariants: ['2 charge stop'],
        steps: [
          {
            latitude: 0,
            longitude: 0,
            name: 'Your position',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now(),
                timezone: 'Europe/Vienna',
              },
              distanceRemaining: { value: 0, unit: 'meters' },
              timeRemaining: 0,
            },
          },
          {
            latitude: 0,
            longitude: 0,
            name: 'Dresden',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now() + 5.5 * 3600000,
                timezone: 'Europe/Berlin',
              },
              distanceRemaining: { unit: 'kilometers', value: 350 },
              timeRemaining: 5.5 * 3600,
            },
          },
        ],
      },
    ],
  },
  {
    id: '#1',
    routeChoices: [
      {
        id: '#1-0',
        summaryVariants: ['Fastest route'],
        additionalInformationVariants: ['Fastest route'],
        selectionSummaryVariants: ['1 charge stop'],
        steps: [
          {
            latitude: 0,
            longitude: 0,
            name: 'Your position',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now(),
                timezone: 'Europe/Vienna',
              },
              distanceRemaining: { value: 0, unit: 'meters' },
              timeRemaining: 0,
            },
          },
          {
            latitude: 0,
            longitude: 0,
            name: 'Dresden',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now() + 4.5 * 3600000,
                timezone: 'Europe/Berlin',
              },
              distanceRemaining: { unit: 'kilometers', value: 400 },
              timeRemaining: 4.5 * 3600,
            },
          },
        ],
      },
    ],
  },
  {
    id: '#2',
    routeChoices: [
      {
        id: '#2-0',
        summaryVariants: ['Shortest route'],
        additionalInformationVariants: ['Shortest route'],
        selectionSummaryVariants: ['2 charge stop'],
        steps: [
          {
            latitude: 0,
            longitude: 0,
            name: 'Your position',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now(),
                timezone: 'Europe/Vienna',
              },
              distanceRemaining: { value: 0, unit: 'meters' },
              timeRemaining: 0,
            },
          },
          {
            latitude: 0,
            longitude: 0,
            name: 'Dresden',
            travelEstimates: {
              arrivalTime: {
                timeSinceEpochMillis: Date.now() + 5.5 * 3600000,
                timezone: 'Europe/Berlin',
              },
              distanceRemaining: { unit: 'kilometers', value: 450 },
              timeRemaining: 5.5 * 3600,
            },
          },
        ],
      },
    ],
  },
];

export const TextConfig: TripPreviewTextConfiguration = {
  additionalRoutesButtonTitle: 'Alternatives',
  overviewButtonTitle: 'Overview',
  startButtonTitle: 'Start',
  travelEstimatesTitle: 'Arrival:',
};
