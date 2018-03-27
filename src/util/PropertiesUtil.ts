import { DataNodeProperties } from '../component/DataNode';
import { ComponentGenerator } from '../component/ListContainer';
import { ObservationProperties } from '../event/types';
import { DATA_NODE_PROPERTIES, SPECIFIC_PROPERTIES, STYLE_PROPERTIES } from './const';
import { Properties } from './types';

export namespace PropertiesUtil {
  export function getDataNodeProperties(properties: Properties): DataNodeProperties {
    return {
      id: properties[DATA_NODE_PROPERTIES.ID],
      name: properties[DATA_NODE_PROPERTIES.NAME]
    };
  }

  export function getTransformer(properties: Properties) {
    const type = properties[SPECIFIC_PROPERTIES.VALUE_TYPE];

    switch (type) {
      case 'number': return (value: string) => parseInt(value);
      case 'number.float': return (value: string) => parseFloat(value);
      default: return (value: string) => value;
    }
  }

  export function getGenerator<M>(properties: Properties): ComponentGenerator<M> {
    const generator = properties[SPECIFIC_PROPERTIES.GENERATOR];

    if (typeof generator === 'function') {
      return generator;
    }
  }

  export function getStyleProperties(properties: Properties) {
    return {
      class: properties[STYLE_PROPERTIES.CLASS],
      style: properties[STYLE_PROPERTIES.STYLE]
    };
  }

  export function getNativeProperties(properties: Properties) {
    const nativeProps: Properties = { ...properties };

    delete nativeProps[DATA_NODE_PROPERTIES.ID];
    delete nativeProps[SPECIFIC_PROPERTIES.VALUE_TYPE];
    delete nativeProps[SPECIFIC_PROPERTIES.GENERATOR];
    delete nativeProps[STYLE_PROPERTIES.CLASS];
    delete nativeProps[STYLE_PROPERTIES.STYLE];

    return nativeProps;
  }

  export function getObservationProperties(properties: Properties) {
    const observationProperties: ObservationProperties = {};

    Object.keys(properties).forEach(prop => {
      const propValue = properties[prop];

      if (prop.startsWith('on') && typeof propValue === 'object') {
        observationProperties[prop.substr(2)] = { ...propValue };
      }
    });

    return observationProperties;
  }
}
