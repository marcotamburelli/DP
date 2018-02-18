import { BaseComponent, GenericComponent, ScopeProperties } from './BaseComponent';
import { IsContainer } from './Components';
import { DomWrappers } from './DomWrappers';

/**
 * Basic element.
 * @template E The type of DOM node.
 */
export class Container<M, E extends Element> extends BaseComponent<M, E> implements IsContainer {
  constructor(element: E, scopeProperties: ScopeProperties = { namespace: 'default' }) {
    super(DomWrappers.simple(element), scopeProperties);
  }

  setModel(model: M) {
    this.getContext().updateModel(model);
  }

  getModel() {
    return this.getContext().extractModel<M>();
  }

  queryByName(name: string) {
    return this.getContext().getByName<M, GenericComponent>(name);
  }

  queryById(id: string) {
    return this.getContext().getById<M, GenericComponent>(id);
  }
}
