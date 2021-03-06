import { NATIVE_PROPERTIES, STYLE_PROPERTIES } from './const';
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
    const regEx = /(\w+(-\w+)*)\s*:\s*(\w*(\s|\w)*\w)/g;
    const obj: { [prop: string]: string } = {};

    for (let result = regEx.exec(style); result !== null; result = regEx.exec(style)) {
      const key = toCamelCase(result[1]);
      const value = result[3];

      obj[key] = value;
    }

    return obj;
  }

  function applyClass(element: HTMLElement, cssClass: string[] | string | { [cssClass: string]: boolean }) {
    if (typeof cssClass === 'string') {
      var classes = cssClass.split(' ');
    } else if (Array.isArray(cssClass)) {
      classes = cssClass;
    } else {
      classes = Object.keys(cssClass).filter(className => cssClass[className]);
    }

    classes.forEach(className => element.classList.add(className));
  }

  function applyStyle(element: HTMLElement, style: { [prop: string]: any } | string) {
    if (typeof style === 'string') {
      var styleObj = stringToStyleObject(style);
    } else {
      styleObj = { ...style };
    }

    const elementStyle = element.style;

    Object.keys(styleObj).forEach(key => elementStyle[key] = styleObj[key]);
  }

  function extractStyle(element: HTMLElement) {
    const { style } = element;
    const styleValue: { [prop: string]: any; } = {};
    const propCount = style.length;

    for (let i = 0; i < propCount; i++) {
      const prop = style[i];

      styleValue[toCamelCase(prop)] = style.getPropertyValue(prop);
    }

    return styleValue;
  }

  function extractClass(element: HTMLElement) {
    const { classList } = element;
    const cssClass: string[] = [];

    for (const className of classList) {
      cssClass.push(className);
    }

    return cssClass;
  }

  export function applyProperty(element: Element, { name, value }: { name: string, value: any }) {
    const { classList, style } = element as HTMLElement;

    if (classList && name === STYLE_PROPERTIES.CLASS) {
      return applyClass(element as HTMLElement, value);
    }

    if (style && name === STYLE_PROPERTIES.STYLE) {
      return applyStyle(element as HTMLElement, value);
    }

    if (name.startsWith('on') && typeof value === 'function') {
      return element.addEventListener(name.substr(2), value);
    }

    const attr = document.createAttribute(name);

    attr.value = value;
    element.attributes.setNamedItem(attr);
  }

  export function extractProperty(element: Element, name: string) {
    const { classList, style } = element as HTMLElement;

    if (classList && name === STYLE_PROPERTIES.CLASS) {
      return extractClass(element as HTMLElement);
    }

    if (style && name === STYLE_PROPERTIES.STYLE) {
      return extractStyle(element as HTMLElement);
    }

    const attr = element.attributes.getNamedItem(name);

    if (attr != null) {
      return attr.value;
    }
  }

  export function applyProperties(element: Element, properties: Properties) {
    /* The 'type' is better to set before others */
    if (properties[NATIVE_PROPERTIES.TYPE]) {
      applyProperty(element, { name: NATIVE_PROPERTIES.TYPE, value: properties[NATIVE_PROPERTIES.TYPE] });
    }

    Object.keys(properties).forEach(name => {
      if (name === NATIVE_PROPERTIES.TYPE) {
        return;
      }

      const value = properties[name];

      applyProperty(element, { name, value });
    });
  }
}
