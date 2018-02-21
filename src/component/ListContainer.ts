import { BaseComponent, ChildComponent, DataDrivenComponentImpl, DomBasedComponent } from './BaseComponent';
import { Component, IsDataDriven, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './DomWrappers';

export type ComponentGenerator<D> = ((data: D, idx?: number) => DomBasedComponent & IsDataDriven<D>);

export class ListContainer<M> extends DataDrivenComponentImpl<M[], any> implements IsList {
  private children: (Component | IsDataDriven<any>)[];
  private idx = 0;

  constructor(private generator: ComponentGenerator<M>, dataNodeProps?: DataNodeProperties) {
    super(DomWrappers.array(), dataNodeProps);

    this.children = [];
  }

  append(child: ChildComponent) {
    super.append(child);

    if (child instanceof BaseComponent) {
      this.children.push(child);
    }
  }

  remove(child: DomBasedComponent) {
    super.remove(child);

    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1);
      }
    }
  }

  setData(data: M[]) {
    if (!this.generator) {
      return;
    }

    while (this.children.length) {
      super.remove(this.children.pop() as DomBasedComponent);
    }

    data.forEach((dataItem, i) => {
      const child = this.generator(dataItem, i);

      child.setData(dataItem);
      this.append(child);
    });
  }

  getData() {
    // return this.children.map(child => BaseComponent.extractDataNodeFrom(child as DomBasedComponent).getData());
    return this.children.map(child => (child as IsDataDriven<any>).getData());
  }

  queryByIdx<C extends Component>(idx: number) {
    return this.children[idx] as C;
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }
}
