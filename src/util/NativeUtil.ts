import { NATIVE_PROPERTIES } from './const';
import { Properties } from './types';

export namespace NativeUtil {
  function toCamelCase(key: string) {
    return key.replace(/((-?)\w+)/g, (match, index) => {
      if (match.charAt(0) === '-') {
        return `${match.charAt(1).toUpperCase()}${match.substr(2).toLowerCase()}`;
      } else {
        return match.toLowerCase();
      }
    });
  }

  function stringToStyleObject(style: string) {
    var regEx = /(\w+(-\w+)*)\s*:\s*(\w*(\s|\w)*\w)/g;
    var obj: { [prop: string]: string } = {};

    for (let result = regEx.exec(style); result !== null; result = regEx.exec(style)) {
      const key = toCamelCase(result[1]);
      const value = result[3];

      obj[key] = value;
    }

    return obj;
  }

  export function applyClass(element: HTMLElement, classProp: string) {
    classProp.split(' ').forEach(_class => element.classList.add(_class));
  }

  export function applyStyle(element: HTMLElement, style: { [prop: string]: string } | string) {
    if (typeof style === 'string') {
      var styleObj = stringToStyleObject(style);
    } else {
      styleObj = { ...style };
    }

    var elementStyle = element.style;

    Object.keys(styleObj).forEach(key => elementStyle[key] = styleObj[key]);
  }

  export function applyProperties(element: HTMLElement, properties: Properties) {
    /* The 'type' is better to set before others */
    if (properties[NATIVE_PROPERTIES.TYPE]) {
      element[NATIVE_PROPERTIES.TYPE] = properties[NATIVE_PROPERTIES.TYPE];
    }

    Object.keys(properties).forEach(prop => {
      if (prop === NATIVE_PROPERTIES.TYPE) {
        return;
      }

      const propValue = properties[prop];

      if (prop.startsWith('on') && typeof propValue === 'function') {
        element.addEventListener(prop.substr(2), propValue);
      } else {
        element[prop] = propValue;
      }
    });
  }
}
