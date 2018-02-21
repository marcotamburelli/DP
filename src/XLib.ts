import { Builder, ChildDef, Definition } from './Builder';
import { BaseComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven, IsList } from './component/Components';
import { HasChannel } from './event/types';
import { UseCase } from './UseCase';
import { Properties } from './util/types';

export namespace XLib {
  export type Container<M> = DomBasedComponent & IsDataDriven<M> & IsContainer;
  export type List<M> = DomBasedComponent & IsDataDriven<M> & IsList;
  export type ControlComponent<M> = DomBasedComponent & IsDataDriven<M>;

  export function List(props: Properties) {
    return Builder.createList(props);
  }

  export function Text(props: Properties) {
    return Builder.createText(props);
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
