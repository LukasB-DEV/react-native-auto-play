import type { Distance } from './Text';

export type RouteChoice = {
  id: string;
  /**
   * Title on the alternatives, only visible when providing more then one routeChoices
   */
  summaryVariants: Array<string>;
  /**
   * Content shown on the overview, only property visible when providing a single routeChoice
   */
  additionalInformationVariants: Array<string>;
  /**
   * Subtitle on the alternatives, only visible when providing more then one routeChoices
   * travelEstimates are automatically appended to this one
   */
  selectionSummaryVariants: Array<string>;

  /**
   * ⚠️ name of the last step is used as title on Android Auto,
   * ideally all these should have the same name to make sure to not exceed the step count
   * https://developer.android.com/design/ui/cars/guides/ux-requirements/plan-task-flows#steps-refreshes
   */
  steps: Array<TripPoint>;
};

export type TripPoint = {
  latitude: number;
  longitude: number;
  name: string;
  /**
   * includes the duration until arriving at this step, distance to this step and arrival time with timezone
   */
  travelEstimates: TravelEstimates;
  /**
   * @namespace Android
   */
  address?: string;
  /**
   * @namespace Android
   */
  tripText?: string;
  /**
   * @namespace Android
   */
  tripIcon?: number;
};

export type TripConfig = {
  id: string;
  routeChoices: Array<RouteChoice>;
};

export type TripPreviewTextConfiguration = {
  startButtonTitle: string;
  additionalRoutesButtonTitle: string;
  overviewButtonTitle: string;
  /**
   * specifies the title for the travel estimates row on the trip preview
   * @namespace Android
   */
  travelEstimatesTitle: string;
};

export type DateTimeWithZone = {
  timeSinceEpochMillis: number;
  timezone: string;
};

export type TravelEstimates = {
  /**
   * Distance remaining, setting it to a negative number will put the timeRemaining in the maneuver
   */
  distanceRemaining: Distance;
  /**
   * Time remaining in seconds
   */
  timeRemaining: number;
  /**
   * arrival time in ms and timezone
   */
  arrivalTime: DateTimeWithZone;
};
