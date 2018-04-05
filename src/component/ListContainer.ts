import { BaseComponent, DataDrivenComponentImpl, DomBasedComponent } from './BaseComponent';
import { Component, IsDataDriven, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './dom/DomWrappers';

export type ComponentGenerator<D> = ((data: D, idx?: number) => DomBasedComponent & IsDataDriven<D>);

export class ListContainer<D> extends DataDrivenComponentImpl<D[], any> implements IsList {
  private children: (Component | IsDataDriven<any>)[];

  constructor(private generator: ComponentGenerator<D>, dataNodeProps?: DataNodeProperties) {
    super(DomWrappers.group(), dataNodeProps);

    this.children = [];
  }

  append(child: any) {
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

  setData(data: D[]) {
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
    return this.children.map(child => (child as IsDataDriven<any>).getData());
  }

  getChildCount() {
    return this.children.length;
  }

  getFirstChild<C extends Component>() {
    return this.children[0] as C;
  }

  getLastChild<C extends Component>() {
    return this.children[this.children.length - 1] as C;
  }

  queryByIdx<C extends Component>(idx: number) {
    return this.children[idx] as C;
  }

  queryByName<C extends Component>(name: string): C[] {
    return this.dataNode.getByName(name);
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }
}
