import { GenericComponent } from './BaseComponent';

export interface IsContainer {
  queryByName(name: string): GenericComponent;

  queryById(id: string): GenericComponent;
}

export interface IsList {
  queryByIdx(idx: number): GenericComponent;

  queryById(id: string);
}

export interface HasModel<M> {
  getModel(): M;

  setModel(model: M);
}
