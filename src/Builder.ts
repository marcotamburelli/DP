import { ChildComponent, GenericComponent } from './component/BaseComponent';
import { Container } from './component/Container';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  SelectComponent,
  TextInputComponent,
} from './component/HtmlComponents';
import { NATIVE_PROPERTIES, NODES } from './util/const';
import { NativeUtil } from './util/NativeUtil';
import { PropertiesUtil } from './util/PropertiesUtil';
import { HTML, Properties } from './util/types';

export type ChildDef = (ChildComponent | ChildComponent[]);
export type Generator = HTML | ((props: Properties) => GenericComponent) | GenericComponent;

namespace DomFactory {
  export function createElement<E extends HTMLElement>(tag: HTML, properties: Properties) {
    var element = document.createElement(tag);

    var styleProps = PropertiesUtil.getStyleProperties(properties);
    var nativeProps = PropertiesUtil.getNativeProperties(properties);

    styleProps.class && NativeUtil.applyClass(element, styleProps.class);
    styleProps.style && NativeUtil.applyStyle(element, styleProps.style);
    NativeUtil.applyProperties(element, nativeProps);

    return element as E;
  }
}

export namespace Builder {
  function createHtmlComponent(tag: HTML, properties: Properties) {
    var element = DomFactory.createElement(tag, properties);
    var scopeProperties = PropertiesUtil.getScopeProperties(properties);

    if (scopeProperties.namespace) {
      return new Container(element, scopeProperties);
    } else {
      return new HtmlElementComponent<string | number>(
        element,
        scopeProperties,
        PropertiesUtil.getTransformer(properties)
      );
    }
  }

  function createInputComponent(properties: Properties) {
    var element = DomFactory.createElement<HTMLInputElement>('input', properties);
    var scopeProperties = PropertiesUtil.getScopeProperties(properties);

    if (scopeProperties.namespace) {
      throw new Error(`'input' cannot have a namespace`);
    }

    switch (properties[NATIVE_PROPERTIES.TYPE]) {
      case 'checkbox':
        return new CheckBoxInputComponent(element, scopeProperties);

      default:
        return new TextInputComponent<string | number>(element, scopeProperties, PropertiesUtil.getTransformer(properties));
    }
  }

  function createSelectComponent(properties: Properties) {
    var element = DomFactory.createElement<HTMLSelectElement>('select', properties);
    var scopeProperties = PropertiesUtil.getScopeProperties(properties);

    // if (scopeProperties.namespace) {
    //   return new Container(element, scopeProperties);
    // } else {
    return new SelectComponent<string | number>(element, scopeProperties, PropertiesUtil.getTransformer(properties));
    // }
  }

  export function appendChildDef(parent: GenericComponent, child: ChildDef) {
    if (Array.isArray(child)) {
      child.forEach(c => parent.append(c));
    } else {
      parent.append(child);
    }
  }

  export function createComponent(tag: HTML, properties: Properties) {
    switch (tag) {
      case NODES.DIV:
      case NODES.LABEL:
      case NODES.OPTION:
      case NODES.SPAN:
      case NODES.BUTTON:
        return createHtmlComponent(tag, properties);

      case NODES.INPUT:
        return createInputComponent(properties);

      case NODES.OPTION:
        return createSelectComponent(properties);
    }

    throw new Error(`'${tag}' not supported`);
  }
}
