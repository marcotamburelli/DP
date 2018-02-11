import { ChildComponent, GenericComponent, ScopeProperties } from './component/BaseComponent';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  SelectComponent,
  TextInputComponent
} from './component/HtmlComponents';
import { ScopedComponent } from './component/ScopedComponent';
import { DOM_PROPERTIES, HTML, NATIVE_PROPERTIES, NODES, SCOPE_PROPERTIES, SPECIFIC_PROPERTIES } from './const';

export interface Properties { [prop: string]: string; };
export type ChildDef = (ChildComponent | ChildComponent[]);
export type Generator = HTML | ((props: Properties) => GenericComponent);

namespace PropertiesUtil {
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

  export function getDomProperties(properties: Properties) {
    return {
      class: properties[DOM_PROPERTIES.CLASS],
      style: properties[DOM_PROPERTIES.STYLE]
    };
  }

  export function getNativeProperties(properties: Properties) {
    var nativeProps = { ...properties } as Properties;

    delete nativeProps[SCOPE_PROPERTIES.NAMESPACE];
    delete nativeProps[SCOPE_PROPERTIES.ID];
    delete nativeProps[SPECIFIC_PROPERTIES.VALUE_TYPE];
    delete nativeProps[DOM_PROPERTIES.CLASS];
    delete nativeProps[DOM_PROPERTIES.STYLE];

    return nativeProps;
  }

  export function setElementProperties(properties: Properties, element: HTMLElement) {
    var domProperties = PropertiesUtil.getDomProperties(properties);
    var nativeProperties = PropertiesUtil.getNativeProperties(properties);

    domProperties.class && domProperties.class.split(' ')
      .forEach(_class => element.classList.add(_class));

    // TODO Missing styles

    Object.keys(nativeProperties).forEach(prop => {
      element[prop] = nativeProperties[prop];
    });
  }
}

export namespace Builder {
  function createHtmlComponent(tag: HTML, properties: Properties) {
    var element = document.createElement(tag);

    PropertiesUtil.setElementProperties(properties, element);

    var scopeProperties = PropertiesUtil.getScopeProperties(properties);

    if (scopeProperties.namespace) {
      return new ScopedComponent(element, scopeProperties);
    } else {
      return new HtmlElementComponent<string | number>(element, scopeProperties, PropertiesUtil.getTransformer(properties));
    }
  }

  function createInputComponent(properties: Properties) {
    var element = document.createElement('input');

    PropertiesUtil.setElementProperties(properties, element);

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
    var element = document.createElement('select');

    PropertiesUtil.setElementProperties(properties, element);

    var scopeProperties = PropertiesUtil.getScopeProperties(properties);

    if (scopeProperties.namespace) {
      return new ScopedComponent(element, scopeProperties);
    } else {
      return new SelectComponent<string | number>(element, scopeProperties, PropertiesUtil.getTransformer(properties));
    }
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
