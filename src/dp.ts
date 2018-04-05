import { Builder, Definition } from './Builder';
import { BaseComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { GroupContainer as ExtGroupContainer } from './component/GroupContainer';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { Listener } from './event/listener';
import { GenericObservable, Message } from './event/types';
import { Properties } from './util/types';

export namespace dp {
  function compose<C extends DomBasedComponent>(component: DomBasedComponent, children: any[]) {
    children.forEach(child => component.append(child));

    return component as C;
  }

  export type Container<D, N extends Node> = BaseComponent<N> & IsDataDriven<D> & IsContainer;
  export type ListContainer<D> = ExtListContainer<D>;
  export type GroupContainer<D> = ExtGroupContainer<D>;
  export type TextComponent<D> = ExtTextComponent<D>;
  export type Component<D, N extends Node> = BaseComponent<N> & IsDataDriven<D>;

  export function List<D>(props: Properties) {
    return Builder.createList<D>(props) as ListContainer<D>;
  }

  export function Group<D>(props: Properties) {
    return Builder.createGroup<D>(props);
  }

  export function Text<D>(props: Properties): TextComponent<D> {
    return Builder.createText(props);
  }

  export function define<C extends DomBasedComponent>(definition: Definition, properties: Properties, ...children: any[]): C {
    if (typeof definition === 'function') {
      return compose(definition(properties || {}), children);
    }

    if (definition instanceof BaseComponent) {
      return compose(definition, children);
    }

    return compose(
      Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent)),
      children
    );
  }

  export function listen<P>(stream: GenericObservable<Message<P>>) {
    return Listener.create(stream);
  }
}
