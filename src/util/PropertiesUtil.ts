import { DataNodeProperties } from '../component/DataNode';
import { ComponentGenerator } from '../component/ListContainer';
import { DATA_NODE_PROPERTIES, SPECIFIC_PROPERTIES, STYLE_PROPERTIES } from './const';
import { Properties } from './types';

export namespace PropertiesUtil {
  export function getDataNodeProperties(properties: Properties) {
    return {
      id: properties[DATA_NODE_PROPERTIES.ID],
      name: properties[DATA_NODE_PROPERTIES.NAME]
    } as DataNodeProperties;
  }

  export function getTransformer(properties: Properties) {
    var type = properties[SPECIFIC_PROPERTIES.VALUE_TYPE];

    switch (type) {
      case 'number': return (value: string) => parseInt(value);
      case 'number.float': return (value: string) => parseFloat(value);
      default: return (value: string) => value;
    }
  }

  export function getGenerator<M>(properties: Properties) {
    var generator = properties[SPECIFIC_PROPERTIES.GENERATOR];

    if (typeof generator === 'function') {
      return generator as ComponentGenerator<M>;
    }
  }

  export function getStyleProperties(properties: Properties) {
    return {
      class: properties[STYLE_PROPERTIES.CLASS],
      style: properties[STYLE_PROPERTIES.STYLE]
    };
  }

  export function getNativeProperties(properties: Properties) {
    var nativeProps = { ...properties } as Properties;

    delete nativeProps[DATA_NODE_PROPERTIES.ID];
    delete nativeProps[SPECIFIC_PROPERTIES.VALUE_TYPE];
    delete nativeProps[SPECIFIC_PROPERTIES.GENERATOR];
    delete nativeProps[STYLE_PROPERTIES.CLASS];
    delete nativeProps[STYLE_PROPERTIES.STYLE];

    return nativeProps;
  }
}
