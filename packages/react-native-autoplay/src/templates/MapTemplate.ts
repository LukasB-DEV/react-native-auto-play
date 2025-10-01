import React from 'react';
import { AppRegistry } from 'react-native';
import { AutoPlay } from '..';
import type { RootComponentInitialProps } from '../types/RootComponent';
import { Template, type TemplateConfig } from './Template';

export type MapTemplateConfig = TemplateConfig & {};

type Config = MapTemplateConfig & {
  component: React.ComponentType<RootComponentInitialProps & { template: MapTemplate }>;
};

export class MapTemplate extends Template<Config> {
  public get type(): string {
    return 'map';
  }

  constructor(config: Config) {
    super(config);

    // biome-ignore lint/complexity/noUselessThisAlias: we need the template reference when the component gets started from react-native
    const template = this;
    const { component, ...rest } = config;

    AppRegistry.registerComponent(
      this.templateId,
      () => (props) => React.createElement(component, { ...props, template })
    );

    AutoPlay.createMapTemplate(rest);
  }

  public setRootTemplate() {
    AutoPlay.setRootTemplate(this.templateId);
  }
}
