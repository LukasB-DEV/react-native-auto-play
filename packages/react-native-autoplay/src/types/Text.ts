export type DistanceMeters = number;
export type DurationSeconds = number;

export type Text = {
  /**
   * use the {distance} and {duration} placeholders inside the string to position the distance and duration props
   */
  text: string;
  distance?: DistanceMeters;
  duration?: DurationSeconds;
};
