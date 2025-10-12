import uuid from 'react-native-uuid';
import { AutoPlay } from '..';
import type { ActionButtonAndroid, ActionButtonIos, AppButton, BackButton } from '../types/Button';
import { NitroActionUtil } from '../utils/NitroAction';

export type ActionsIos<T> = {
  backButton?: BackButton<T>;
  leadingNavigationBarButtons?: [ActionButtonIos<T>, ActionButtonIos<T>] | [ActionButtonIos<T>];
  trailingNavigationBarButtons?: [ActionButtonIos<T>, ActionButtonIos<T>] | [ActionButtonIos<T>];
};

export type ActionsAndroid<T> = {
  startHeaderAction?: AppButton | BackButton<T>;
  endHeaderActions?: [ActionButtonAndroid<T>, ActionButtonAndroid<T>] | [ActionButtonAndroid<T>];
};

export type Actions<T> = {
  android?: ActionsAndroid<T>;
  ios?: ActionsIos<T>;
};

export interface NitroTemplateConfig {
  id: string;
}

export interface TemplateConfig {
  /**
   * Fired before template appears
   */
  onWillAppear?(animated?: boolean): void;

  /**
   * Fired before template disappears
   */
  onWillDisappear?(animated?: boolean): void;

  /**
   * Fired after template appears
   */
  onDidAppear?(animated?: boolean): void;

  /**
   * Fired after template disappears
   */
  onDidDisappear?(animated?: boolean): void;
}

export class Template<TemplateConfigType, ActionsType> {
  public id!: string;

  constructor(config: TemplateConfig & TemplateConfigType) {
    // templates that render on a surface provide their own id, others use a auto generated one
    this.id =
      'id' in config && config.id != null && typeof config.id === 'string' ? config.id : uuid.v4();

    console.log('***', this.id);
  }

  public setRootTemplate() {
    return AutoPlay.setRootTemplate(this.id);
  }

  public push() {
    return AutoPlay.pushTemplate(this.id);
  }

  public setActions<T>(actions?: ActionsType) {
    const nitroActions = NitroActionUtil.convert(actions as Actions<T>);
    AutoPlay.setTemplateActions(this.id, nitroActions);
  }
}
