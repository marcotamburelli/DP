
export interface Component {
  readonly parent: Component;

  queryByName?<C extends Component>(name: string): C;

  queryByIdx?<C extends Component>(idx: number): C;

  queryById?<C extends Component>(id: string): C;
}

export interface IsContainer {
  queryByName<C extends Component>(name: string): C[];

  queryById<C extends Component>(id: string): C;
}

export interface IsList {
  queryByIdx<C extends Component>(idx: number): C;

  queryById<C extends Component>(id: string): C;
}

export interface IsDataDriven<D> {
  getData(): D;

  setData(data: D);
}
