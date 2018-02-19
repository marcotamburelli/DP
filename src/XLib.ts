import { Builder, ChildDef, Definition } from './Builder';
import { BaseComponent, GenericComponent } from './component/BaseComponent';
import { HasModel, IsContainer } from './component/Components';
import { HasChannel } from './event/types';
import { UseCase } from './UseCase';
import { Properties } from './util/types';

export namespace XLib {
  export type Container<M> = GenericComponent & HasModel<M> & IsContainer;
  export type ControlComponent<M> = GenericComponent & HasModel<M>;

  export function List(props: Properties) {
    return Builder.createList(props);
  }

  export function Text(props: Properties) {
    return Builder.createText(props);
  }

  export function define(definition: Definition, properties: Properties, ...children: ChildDef[]) {
    if (typeof definition === 'function') {
      var component = definition(properties);
    } else if (definition instanceof BaseComponent) {
      component = definition;
    } else {
      component = Builder.createComponent(definition, properties);
    }

    children.forEach(child => Builder.appendChildDef(component, child));

    return component as GenericComponent;
  }

  export function useCaseFor(...actors: HasChannel[]) {
    return new UseCase(actors);
  }
}
