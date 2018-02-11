import { Builder, ChildDef, Generator, Properties } from './Builder';
import { GenericComponent } from './component/BaseComponent';
import { HasModel, IsContainer } from './component/types';
import { HasChannel } from './event/types';
import { UseCase } from './UseCase';

export namespace XLib {
  export type Container<M> = GenericComponent & HasModel<M> & IsContainer;
  export type ControlComponent<M> = GenericComponent & HasModel<M>;

  export function define(generator: Generator, properties: Properties, ...children: ChildDef[]) {
    if (typeof generator === 'function') {
      var component = generator(properties);
    } else {
      component = Builder.createComponent(generator, properties);
    }

    children.forEach(child => Builder.appendChildDef(component, child));

    return component as GenericComponent;
  }

  export function useCaseFor(...actors: HasChannel[]) {
    return new UseCase(actors);
  }
}
