import { AutoPlay } from '..';
import type { ButtonImage } from '../types/Button';
import type { Text } from '../types/Text';
import { NitroAction } from '../utils/NitroAction';
import { type NitroSection, NitroSectionConvert } from '../utils/NitroSection';
import { type Actions, Template, type TemplateConfig } from './Template';

type BaseRow = {
  title: Text;
  detailedText?: Text;
  enabled?: boolean;
  image?: ButtonImage;
};

export type DefaultRow = BaseRow & {
  type: 'default';
  /**
   * adds a chevron at the end of the row
   */
  browsable?: boolean;
  onPress: () => void;
};

export type ToggleRow = BaseRow & {
  type: 'toggle';
  checked: boolean;
  onPress: (checked: boolean) => void;
};

export type RadioRow = BaseRow & {
  type: 'radio';
  onPress: () => void;
};

export type MultiSection =
  | {
      type: 'default';
      title: string;
      items: Array<DefaultRow | ToggleRow>;
    }
  | {
      type: 'radio';
      title: string;
      items: Array<RadioRow>;
      selectedIndex: number;
    };

export type SingleSection = {
  [K in MultiSection as K['type']]: Omit<K, 'title' | 'detailedText'>;
}[MultiSection['type']];

export type Section = Array<MultiSection> | SingleSection;

export interface NitroListTemplateConfig extends TemplateConfig {
  actions?: Array<NitroAction>;
  title: Text;
  sections?: Array<NitroSection>;
}

export type ListTemplateConfig = Omit<NitroListTemplateConfig, 'actions' | 'sections'> & {
  /**
   * action buttons, usually at the the top right on Android and a top bar on iOS
   */
  actions?: Actions;

  /**
   * a container that groups your list items into sections.
   */
  sections?: Section;
};

export class ListTemplate extends Template<ListTemplateConfig, Actions> {
  public get type(): string {
    return 'list';
  }

  private cleanup: () => void;

  constructor(config: ListTemplateConfig) {
    super(config);

    const { actions, sections, ...rest } = config;

    const nitroConfig: NitroListTemplateConfig = {
      ...rest,
      actions: NitroAction.convert(actions),
      sections: NitroSectionConvert(sections),
    };

    this.cleanup = AutoPlay.createListTemplate(nitroConfig);
  }

  public destroy() {
    this.cleanup();
    super.destroy();
  }
}
