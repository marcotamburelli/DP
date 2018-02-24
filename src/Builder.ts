import { BaseComponent, ChildComponent, DomBasedComponent } from './component/BaseComponent';
import { Container } from './component/Container';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  SelectComponent,
  TextInputComponent
} from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { NATIVE_PROPERTIES, NODES } from './util/const';
import { NativeUtil } from './util/NativeUtil';
import { PropertiesUtil } from './util/PropertiesUtil';
import { HTML, Properties } from './util/types';

export type ChildDef = (ChildComponent | DomBasedComponent[]);
export type Definition = HTML | ((props: Properties) => DomBasedComponent) | DomBasedComponent;

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
  function createContainer(tag: HTML, properties: Properties) {
    var element = DomFactory.createElement(tag, properties);
    var dataNodeProperties = PropertiesUtil.getDataNodeProperties(properties);

    return new Container(element, dataNodeProperties);
  }

  function createHtmlComponent(tag: HTML, properties: Properties) {
    var element = DomFactory.createElement(tag, properties);
    var dataNodeProperties = PropertiesUtil.getDataNodeProperties(properties);

    return new HtmlElementComponent<string | number>(
      element,
      dataNodeProperties,
      PropertiesUtil.getTransformer(properties)
    );
  }

  function createInputComponent(properties: Properties) {
    var element = DomFactory.createElement<HTMLInputElement>('input', properties);
    var dataNodeProperties = PropertiesUtil.getDataNodeProperties(properties);

    switch (properties[NATIVE_PROPERTIES.TYPE]) {
      case 'checkbox':
        return new CheckBoxInputComponent(element, dataNodeProperties);

      default:
        return new TextInputComponent<string | number>(element, dataNodeProperties, PropertiesUtil.getTransformer(properties));
    }
  }

  function createSelectComponent(properties: Properties) {
    var element = DomFactory.createElement<HTMLSelectElement>('select', properties);
    var scopeProperties = PropertiesUtil.getDataNodeProperties(properties);

    // TODO The select box requires a test, especially in case options are provided as array
    // if (scopeProperties.namespace) {
    //   return new Container(element, scopeProperties);
    // } else {
    return new SelectComponent<string | number>(element, scopeProperties, PropertiesUtil.getTransformer(properties));
    // }
  }

  export function appendChildDef(parent: DomBasedComponent, child: ChildDef) {
    if (Array.isArray(child)) {
      child.forEach(c => {
        if (!(c instanceof BaseComponent)) {
          throw new Error('Invalid element to append');
        }

        parent.append(c);
      });
    } else {
      parent.append(child);
    }
  }

  export function createComponent(tag: HTML, properties: Properties, hasChildren: boolean) {
    switch (tag) {
      case NODES.DIV:
      case NODES.UL:
      case NODES.OL:
      case NODES.LI:
      case NODES.FORM:
        return (hasChildren ? createContainer : createHtmlComponent)(tag, properties);

      case NODES.LABEL:
      case NODES.OPTION:
      case NODES.SPAN:
      case NODES.BUTTON:
      case NODES.BUTTON:
      case NODES.A:
      case NODES.P:
      case NODES.H1:
      case NODES.H2:
      case NODES.H3:
      case NODES.H4:
      case NODES.H5:
      case NODES.H6:
      case NODES.BR:
        return createHtmlComponent(tag, properties);

      case NODES.INPUT:
        return createInputComponent(properties);

      case NODES.SELECT:
        return createSelectComponent(properties);
    }

    throw new Error(`'${tag}' not supported`);
  }

  export function createList<D>(properties: Properties) {
    return new ListContainer<D>(PropertiesUtil.getGenerator(properties), PropertiesUtil.getDataNodeProperties(properties));
  }

  export function createText(properties: Properties) {
    return new TextComponent(PropertiesUtil.getDataNodeProperties(properties));
  }
}
