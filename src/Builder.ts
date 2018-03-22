import { DomBasedComponent } from './component/BaseComponent';
import { Container } from './component/Container';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  RadioInputComponent,
  SelectComponent,
  TextInputComponent
} from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { NATIVE_PROPERTIES, NODES } from './util/const';
import { NativeUtil } from './util/NativeUtil';
import { PropertiesUtil } from './util/PropertiesUtil';
import { HTML, Properties } from './util/types';

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
    return new Container(
      DomFactory.createElement(tag, properties),
      PropertiesUtil.getDataNodeProperties(properties),
      PropertiesUtil.getObservationProperties(properties)
    );
  }

  function createHtmlComponent(tag: HTML, properties: Properties) {
    return new HtmlElementComponent<string | number>(
      DomFactory.createElement(tag, properties),
      PropertiesUtil.getDataNodeProperties(properties),
      PropertiesUtil.getObservationProperties(properties),
      PropertiesUtil.getTransformer(properties)
    );
  }

  function createInputComponent(properties: Properties) {
    const element = DomFactory.createElement<HTMLInputElement>('input', properties);
    const dataNodeProperties = PropertiesUtil.getDataNodeProperties(properties);
    const observationProperties = PropertiesUtil.getObservationProperties(properties);

    switch ((properties[NATIVE_PROPERTIES.TYPE] || '').toLowerCase()) {
      case 'checkbox':
        return new CheckBoxInputComponent(element, dataNodeProperties, observationProperties);

      case 'radio':
        return new RadioInputComponent<string | number>(
          element,
          dataNodeProperties,
          observationProperties,
          PropertiesUtil.getTransformer(properties)
        );

      default:
        return new TextInputComponent<string | number>(
          element,
          dataNodeProperties,
          observationProperties,
          PropertiesUtil.getTransformer(properties)
        );
    }
  }

  function createSelectComponent(properties: Properties) {
    return new SelectComponent<string | number>(
      DomFactory.createElement<HTMLSelectElement>('select', properties),
      PropertiesUtil.getDataNodeProperties(properties),
      PropertiesUtil.getObservationProperties(properties),
      PropertiesUtil.getTransformer(properties)
    );
  }

  function normalizeProperties(properties: Properties) {
    const normalizedProperties: Properties = {};

    Object.keys(properties).forEach(key => {
      normalizedProperties[key.toLowerCase()] = properties[key];
    });

    return normalizedProperties;
  }

  export function createComponent(tag: HTML, properties: Properties, hasChildren: boolean) {
    const normalizedProperties: Properties = normalizeProperties(properties);

    switch (tag) {
      case NODES.DIV:
      case NODES.UL:
      case NODES.OL:
      case NODES.LI:
      case NODES.FORM:
        return (hasChildren ? createContainer : createHtmlComponent)(tag, normalizedProperties);

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
        return createHtmlComponent(tag, normalizedProperties);

      case NODES.INPUT:
        return createInputComponent(normalizedProperties);

      case NODES.SELECT:
        return createSelectComponent(normalizedProperties);
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
