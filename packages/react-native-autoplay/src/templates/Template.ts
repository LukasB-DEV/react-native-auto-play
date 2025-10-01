interface BaseEvent {
  /**
   * Template id that fired the event
   */
  templateId: string;
}

export interface TemplateConfig {
  /**
   * Specify an id for your template, must be unique.
   */
  id: string;

  /**
   * Fired before template appears
   * @param e Event
   */
  onWillAppear?(e: BaseEvent): void;

  /**
   * Fired before template disappears
   * @param e Event
   */
  onWillDisappear?(e: BaseEvent): void;

  /**
   * Fired after template appears
   * @param e Event
   */
  onDidAppear?(e: BaseEvent): void;

  /**
   * Fired after template disappears
   * @param e Event
   */
  onDidDisappear?(e: BaseEvent): void;

  /**
   * Fired when popToRootTemplate finished
   */
  onPoppedToRoot?(e: BaseEvent): void;
}

export class Template<P> {
  public get type(): string {
    return 'unset';
  }
  public templateId!: string;

  constructor(public config: TemplateConfig & P) {
    this.templateId = config.id;
  }
}
