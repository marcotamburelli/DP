import { NATIVE_PROPERTIES } from '../util/const';
import { Properties } from '../util/types';
import { BaseComponent, DataDrivenComponentImpl, DomBasedComponent } from './BaseComponent';
import { Component, IsDataDriven, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './dom/DomWrappers';
import { ComponentGenerator } from './generator';

export class ListContainer<D> extends DataDrivenComponentImpl<D[], any> implements IsList {
  readonly isContainer: true = true;
  readonly isList: true = true;

  constructor(private generator: ComponentGenerator<D>, private dataNodeProps?: DataNodeProperties, private nativeProperties?: Properties) {
    super(DomWrappers.group(), dataNodeProps);
  }

  get id() {
    return this.nativeProperties && this.nativeProperties[NATIVE_PROPERTIES.ID];
  }

  append(child: any) {
    if (!(child instanceof BaseComponent)) {
      throw new Error('List can only append component');
    }

    super.append(child);
  }

  setData(data: D[]) {
    if (!this.generator) {
      return;
    }

    while (this.children.length) {
      super.remove(this.children.pop() as DomBasedComponent);
    }

    data.forEach((dataItem) => {
      const child = this.generator();

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

  protected prepareCopy() {
    return new (this.constructor as {
      new(
        generator: ComponentGenerator<D>,
        dataNodeProps: DataNodeProperties
      ): ListContainer<D>
    })(this.generator, this.dataNodeProps);
  }
}
