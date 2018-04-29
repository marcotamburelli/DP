import { Builder } from './Builder';
import { DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { DomBinder } from './component/dom/DomBinder';
import { GroupContainer as ExtGroupContainer } from './component/GroupContainer';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { Listener } from './event/listener';
import { GenericObservable, Message } from './event/types';
import { CustomComponent } from './generator/CustomComponent';
import { ComponentGenerator } from './generator/generator';
import { HTML, Properties } from './util/types';

export class ComponentDefinition { }

export namespace dp {
  function compose(component: DomBasedComponent<any>, children: any[]) {
    children.forEach(child => component.append(child));

    return component;
  }

  export type Definition =
    HTML |
    { new(): ComponentDefinition } |
    ComponentGenerator<any> |
    { new(): CustomComponent<any, any> } |
    DomBasedComponent<any>;

  export type Container<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D> & IsContainer;
  export type ListContainer<D> = ExtListContainer<D>;
  export type GroupContainer<D> = ExtGroupContainer<D>;
  export type TextComponent<D> = ExtTextComponent<D>;
  export type Component<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D>;

  export const IDENTITY_BINDER = DomBinder.IDENTITY_BINDER;
  export const INT_BINDER = DomBinder.INT_BINDER;

  export const DATA_EVENT = 'DATA_EVENT';
  export const DATA_EMITTER = (eventType = DATA_EVENT) => ({ eventType });

  export class List extends ComponentDefinition { }
  export class Group extends ComponentDefinition { }
  export class Text extends ComponentDefinition { }

  export function define<C extends DomBasedComponent<any>>(definition: Definition, properties: Properties, ...children: any[]): C {
    var component: DomBasedComponent<any>;

    if (typeof definition === 'function') {
      component = createComponentFromFunction(definition, properties, children);
    } else if (definition instanceof DomBasedComponent) {
      component = compose(definition, children);
    } else {
      component = compose(
        Builder.createComponent(definition, properties || {}, children.some(child => child instanceof DomBasedComponent)),
        children
      );
    }

    return component as C;
  }

  function createComponentFromFunction(
    definition: (new () => ComponentDefinition) | ComponentGenerator<any> | (new () => CustomComponent<any, any>),
    properties: Properties,
    children: any[]
  ) {
    switch (definition) {
      case List:
        return Builder.createList(properties || {}, children);
      case Group:
        return compose(Builder.createGroup(properties || {}), children);
      case Text:
        return compose(Builder.createText(properties || {}), children);
      default:
        return compose(
          Builder.createCustom(
            definition as ComponentGenerator<any> | (new () => CustomComponent<any, any>),
            properties || {}),
          children
        );
    }
  }

  export function listen<P>(stream: GenericObservable<Message<P>>) {
    return Listener.create(stream);
  }
}
