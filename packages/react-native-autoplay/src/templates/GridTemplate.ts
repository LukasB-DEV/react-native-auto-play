import { AutoPlay } from '..';
import type { GridButton } from '../types/Button';
import type { AutoText } from '../types/Text';
import { NitroAction } from '../utils/NitroAction';
import { NitroImage } from '../utils/NitroImage';
import { type Actions, Template, type TemplateConfig } from './Template';

type NitroGridButton = {
  title: AutoText;
  image: NitroImage;
  onPress: () => void;
};

export interface NitroGridTemplateConfig extends TemplateConfig {
  actions?: Array<NitroAction>;
  title: AutoText;
  buttons: Array<NitroGridButton>;
}

export type GridTemplateConfig = Omit<NitroGridTemplateConfig, 'actions' | 'buttons'> & {
  /**
   * action buttons, usually at the the top right on Android and a top bar on iOS
   */
  actions?: Actions;

  buttons: Array<GridButton>;
};

export class GridTemplate extends Template<GridTemplateConfig, Actions> {
  private cleanup: () => void;

  constructor(config: GridTemplateConfig) {
    super(config);

    const { actions, buttons, ...rest } = config;

    const nitroConfig: NitroGridTemplateConfig = {
      ...rest,
      actions: NitroAction.convert(actions),
      buttons: buttons.map<NitroGridButton>((button) => ({
        title: button.title,
        image: NitroImage.convert(button.image),
        onPress: button.onPress,
      })),
    };

    this.cleanup = AutoPlay.createGridTemplate(nitroConfig);
  }

  public destroy() {
    this.cleanup();
    super.destroy();
  }
}
