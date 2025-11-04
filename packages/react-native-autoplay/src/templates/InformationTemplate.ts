import { NitroModules } from 'react-native-nitro-modules';
import type { HybridInformationTemplate as NitroHybridInformationTemplate } from '../specs/HybridInformationTemplate.nitro';
import type { AutoText } from '../types/Text';
import { type NitroAction, NitroActionUtil } from '../utils/NitroAction';
import { NitroMapButton } from '../utils/NitroMapButton';
import { type NitroSection, NitroSectionUtil } from '../utils/NitroSection';
import type { SingleSection } from './ListTemplate';
import { type BaseMapTemplateConfig, convertMapActions } from './MapTemplate';
import {
  type HeaderActions,
  type NitroBaseMapTemplateConfig,
  type NitroTemplateConfig,
  Template,
  type TemplateConfig,
} from './Template';

const HybridInformationTemplate = NitroModules.createHybridObject<NitroHybridInformationTemplate>(
  'HybridInformationTemplate'
);

export interface NitroInformationTemplateConfig extends TemplateConfig {
  headerActions?: Array<NitroAction>;
  title: AutoText;
  section?: NitroSection;
  actions?: [NitroAction, NitroAction] | [NitroAction];
  mapConfig?: NitroBaseMapTemplateConfig;
}

export type InformationTemplateConfig = Omit<
  NitroInformationTemplateConfig,
  'headerActions' | 'section' | 'mapConfig'
> & {
  /**
   * action buttons, usually at the the top right on Android and a top bar on iOS
   */
  headerActions?: HeaderActions<InformationTemplate>;

  /**
   * a container that groups your items into a single section.
   */
  section?: SingleSection<InformationTemplate>;
  /**
   * If mapConfig is defined, it will use a MapWithContentTemplate with the current template. This results in a PaneTemplate with a map in background. No actions need to be specified, can be empty object.
   * @namespace Android
   */
  mapConfig?: BaseMapTemplateConfig<InformationTemplate>;
};

export class InformationTemplate extends Template<
  InformationTemplateConfig,
  HeaderActions<InformationTemplate>
> {
  private template = this;

  constructor(config: InformationTemplateConfig) {
    super(config);

    const { headerActions, mapConfig, section, ...rest } = config;

    const nitroConfig: NitroInformationTemplateConfig & NitroTemplateConfig = {
      ...rest,
      id: this.id,
      headerActions: NitroActionUtil.convert(this.template, headerActions),
      section: NitroSectionUtil.convert(this.template, section)?.at(0),
      mapConfig: mapConfig
        ? {
            mapButtons: NitroMapButton.convert(this.template, mapConfig.mapButtons),
            headerActions: convertMapActions(this.template, mapConfig.headerActions),
          }
        : undefined,
    };

    HybridInformationTemplate.createInformationTemplate(nitroConfig);
  }

  public updateSections(section?: SingleSection<InformationTemplate>) {
    HybridInformationTemplate.updateInformationTemplateSections(
      this.id,
      NitroSectionUtil.convert(this.template, section)?.at(0)
    );
  }
}
