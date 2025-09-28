/**
 * @namespace iOS
 */
export type TemplateEventPayload = {
  /**
   * A Boolean value indicating whether the system animates the disappearance of the template.
   */
  animated: boolean;
};

export type TemplateState = 'willAppear' | 'didAppear' | 'willDisappear' | 'didDisappear';
