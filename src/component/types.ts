import { GenericComponent } from './BaseComponent';

export interface HasModel<M> {
  setModel(model: M);

  getModel(): M;
}

export interface IsContainer {
  queryByName(name: string): GenericComponent;

  queryById(id: string): GenericComponent;
}
