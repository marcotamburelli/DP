import { Container } from './component/Container';
import { GroupContainer } from './component/GroupContainer';
import {
  CheckBoxInputComponent,
  HtmlElementComponent,
  RadioInputComponent,
  SelectComponent,
  TextInputComponent
} from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { CustomComponent } from './generator/CustomComponent';
import { ComponentGenerator, createGenerator } from './generator/generator';
import { NATIVE_PROPERTIES, NODES } from './util/const';
import { NativeUtil } from './util/NativeUtil';
import { PropertiesReader } from './util/PropertiesReader';
import { HTML, Properties } from './util/types';

namespace DomFactory {
  export function createElement<E extends HTMLElement>(tag: HTML, nativeProperties: Properties) {
    const element = document.createElement(tag);

    NativeUtil.applyProperties(element, nativeProperties);

    return element as E;
  }
}

export namespace Builder {
  function createContainer(tag: HTML, propReader: PropertiesReader) {
    return new Container(
      DomFactory.createElement(tag, propReader.nativeProperties),
      propReader.dataNodeProperties,
      propReader.bindProperties,
      propReader.observationProperties
    );
  }

  function createHtmlComponent(tag: HTML, propReader: PropertiesReader) {
    return new HtmlElementComponent<string | number>(
      DomFactory.createElement(tag, propReader.nativeProperties),
      propReader.dataNodeProperties,
      propReader.bindProperties,
      propReader.observationProperties
    );
  }

  function createInputComponent(propReader: PropertiesReader) {
    const { dataNodeProperties, bindProperties, nativeProperties, observationProperties } = propReader;
    const element = DomFactory.createElement<HTMLInputElement>('input', nativeProperties);

    switch (nativeProperties[NATIVE_PROPERTIES.TYPE] || '') {
      case 'checkbox':
        return new CheckBoxInputComponent(
          element,
          dataNodeProperties,
          bindProperties,
          observationProperties
        );

      case 'radio':
        return new RadioInputComponent<string | number>(
          element,
          dataNodeProperties,
          bindProperties,
          observationProperties
        );

      default:
        return new TextInputComponent<string | number>(
          element,
          dataNodeProperties,
          bindProperties,
          observationProperties
        );
    }
  }

  function createSelectComponent(propReader: PropertiesReader) {
    return new SelectComponent<string | number>(
      DomFactory.createElement<HTMLSelectElement>('select', propReader.nativeProperties),
      propReader.dataNodeProperties,
      propReader.bindProperties,
      propReader.observationProperties
    );
  }

  export function createComponent(tag: HTML, properties: Properties, hasChildren: boolean) {
    const propReader = PropertiesReader.create(properties);

    switch (tag) {
      case NODES.DIV:
      case NODES.UL:
      case NODES.OL:
      case NODES.LI:
      case NODES.FORM:
        return (hasChildren ? createContainer : createHtmlComponent)(tag, propReader);

      case NODES.LABEL:
      case NODES.OPTION:
      case NODES.SPAN:
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
        return createHtmlComponent(tag, propReader);

      case NODES.INPUT:
      case NODES.TEXTAREA:
        return createInputComponent(propReader);

      case NODES.SELECT:
        return createSelectComponent(propReader);
    }

    throw new Error(`'${tag}' not supported`);
  }

  export function createList<D>(properties: Properties, children: any[]) {
    const { dataNodeProperties, nativeProperties } = PropertiesReader.create(properties);

    return new ListContainer<D>(createGenerator(children), dataNodeProperties, nativeProperties);
  }

  export function createGroup<D>(properties: Properties) {
    const { dataNodeProperties, nativeProperties } = PropertiesReader.create(properties);

    return new GroupContainer<D>(dataNodeProperties, nativeProperties);
  }

  export function createText<D>(properties: Properties) {
    const { dataNodeProperties, bindProperties, nativeProperties } = PropertiesReader.create(properties);

    return new TextComponent<D>(dataNodeProperties, bindProperties, nativeProperties);
  }

  export function createCustomFromFunction<D>(generator: ComponentGenerator<D>, properties: Properties): CustomComponent<D, Node> {
    return new class extends CustomComponent<D, Node> {
      constructor(props: Properties) {
        super(props);
      }

      protected generateComponent() {
        return generator(properties);
      }
    }(properties);
  }
}
