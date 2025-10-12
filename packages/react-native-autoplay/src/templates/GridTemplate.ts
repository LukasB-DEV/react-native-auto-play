import { AutoPlay } from '..';
import type { AutoText } from '../types/Text';
import { type NitroAction, NitroActionUtil } from '../utils/NitroAction';
import { type GridButton, type NitroGridButton, NitroGridUtil } from '../utils/NitroGrid';
import { type Actions, type NitroTemplateConfig, Template, type TemplateConfig } from './Template';

export interface NitroGridTemplateConfig extends TemplateConfig {
  actions?: Array<NitroAction>;
  title: AutoText;
  buttons: Array<NitroGridButton>;
}

export type GridTemplateConfig = Omit<NitroGridTemplateConfig, 'actions' | 'buttons'> & {
  /**
   * action buttons, usually at the the top right on Android and a top bar on iOS
   */
  actions?: Actions<GridTemplate>;

  buttons: Array<GridButton<GridTemplate>>;
};

export class GridTemplate extends Template<GridTemplateConfig, Actions<GridTemplate>> {
  private template = this;

  constructor(config: GridTemplateConfig) {
    super(config);

    const { actions, buttons, ...rest } = config;

    const nitroConfig: NitroGridTemplateConfig & NitroTemplateConfig = {
      ...rest,
      id: this.id,
      actions: NitroActionUtil.convert(this.template, actions),
      buttons: NitroGridUtil.convert(this.template, buttons),
    };

    AutoPlay.createGridTemplate(nitroConfig);
  }

  public updateGrid(buttons: Array<GridButton<GridTemplate>>) {
    AutoPlay.updateGridTemplateButtons(this.id, NitroGridUtil.convert(this.template, buttons));
  }
}
