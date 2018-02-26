import { Builder, ChildDef, Definition } from './Builder';
import { BaseComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { HasChannel } from './event/types';
import { UseCase } from './UseCase';
import { Properties } from './util/types';

export namespace XLib {
  export type Container<D, N extends Node> = BaseComponent<N> & IsDataDriven<D> & IsContainer;
  export type ListContainer<D> = ExtListContainer<D>;
  export type TextComponent = ExtTextComponent;
  export type ControlComponent<D, N extends Node> = BaseComponent<N> & IsDataDriven<D>;

  export function List<D>(props: Properties) {
    return Builder.createList<D>(props) as ListContainer<D>;
  }

  export function Text(props: Properties) {
    return Builder.createText(props) as TextComponent;
  }

  export function define<C extends DomBasedComponent>(definition: Definition, properties: Properties, ...children: ChildDef[]) {
    if (typeof definition === 'function') {
      var component = definition(properties || {});
    } else if (definition instanceof BaseComponent) {
      component = definition;
    } else {
      component = Builder.createComponent(definition, properties || {}, children.some(child => typeof child !== 'string'));
    }

    children.forEach(child => Builder.appendChildDef(component, child));

    return component as C;
  }

  export function useCaseFor(...actors: HasChannel[]) {
    return new UseCase(actors);
  }
}
