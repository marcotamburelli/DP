import { Builder } from './Builder';
import { DataDrivenComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { DomBinder } from './component/dom/DomBinder';
import { GroupContainer as ExtGroupContainer } from './component/GroupContainer';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { Listener } from './event/listener';
import { GenericObservable, Message } from './event/types';
import { HTML, Properties } from './util/types';

export namespace dp {
  function compose(component: DomBasedComponent<any>, children: any[]) {
    children.forEach(child => component.append(child));

    return component;
  }

  export type Definition = HTML | ((props: Properties, children?: any[]) => DataDrivenComponent<any, any>) | DomBasedComponent<any>;

  export type Container<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D> & IsContainer;
  export type ListContainer<D> = ExtListContainer<D>;
  export type GroupContainer<D> = ExtGroupContainer<D>;
  export type TextComponent<D> = ExtTextComponent<D>;
  export type Component<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D>;

  export const IDENTITY_BINDER = DomBinder.IDENTITY_BINDER;
  export const INT_BINDER = DomBinder.INT_BINDER;

  export const DATA_EVENT = 'DATA_EVENT';
  export const DATA_EMITTER = (eventType = DATA_EVENT) => ({ eventType });

  export function List<D>(props: Properties, children: any[]) {
    return Builder.createList<D>(props, children) as ListContainer<D>;
  }

  export function Group<D>(props: Properties) {
    return Builder.createGroup<D>(props);
  }

  export function Text<D>(props: Properties): TextComponent<D> {
    return Builder.createText(props);
  }

  export function define<C extends DomBasedComponent<any>>(definition: Definition, properties: Properties, ...children: any[]): C {
    var component: DomBasedComponent<any>;

    switch (definition) {
      case List:
        component = List(properties || {}, children);
        break;

      case Group:
        component = compose(Group(properties || {}), children);
        break;

      case Text:
        component = compose(Text(properties || {}), children);
        break;

      default:
        if (typeof definition === 'function') {
          component = compose(
            Builder.createCustomFromFunction(definition, properties || {}),
            children
          );
        } else if (definition instanceof DomBasedComponent) {
          component = compose(definition, children);
        } else {
          component = compose(
            Builder.createComponent(definition, properties || {}, children.some(child => child instanceof DomBasedComponent)),
            children
          );
        }
        break;
    }

    return component as C;
  }

  export function listen<P>(stream: GenericObservable<Message<P>>) {
    return Listener.create(stream);
  }
}
