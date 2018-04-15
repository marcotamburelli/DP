import { EventType, IsObservable } from '../event/types';

export interface Component {
  readonly id: string;

  append(child);

  remove(child: Component);

  createObservable<P>(observedEvent?: EventType): IsObservable<P>;
}

export interface HasDomNode<N extends Node> {
  readonly domNode?: N;
}

export interface IsContainer {
  queryByName<C extends Component>(name: string): C[];

  queryById<C extends Component>(id: string): C;
}

export interface IsList extends IsContainer {
  queryByIdx<C extends Component>(idx: number): C;
}

export interface IsDataDriven<D> {
  getData(): D;

  setData(data: D);
}
