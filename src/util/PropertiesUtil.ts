import { ScopeProperties } from '../component/BaseComponent';
import { SCOPE_PROPERTIES, SPECIFIC_PROPERTIES, STYLE_PROPERTIES } from './const';
import { Properties } from './types';

export namespace PropertiesUtil {
  export function getScopeProperties(properties: Properties) {
    return {
      namespace: properties[SCOPE_PROPERTIES.NAMESPACE],
      id: properties[SCOPE_PROPERTIES.ID],
      name: properties[SCOPE_PROPERTIES.NAME]
    } as ScopeProperties;
  }

  export function getTransformer(properties: Properties) {
    var type = properties[SPECIFIC_PROPERTIES.VALUE_TYPE];

    switch (type) {
      case 'number': return (value: string) => parseInt(value);
      case 'number.float': return (value: string) => parseFloat(value);
      default: return (value: string) => value;
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

    delete nativeProps[SCOPE_PROPERTIES.NAMESPACE];
    delete nativeProps[SCOPE_PROPERTIES.ID];
    delete nativeProps[SPECIFIC_PROPERTIES.VALUE_TYPE];
    delete nativeProps[STYLE_PROPERTIES.CLASS];
    delete nativeProps[STYLE_PROPERTIES.STYLE];

    return nativeProps;
  }
}
