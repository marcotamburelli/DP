import { NATIVE_PROPERTIES } from '../util/const';
import { Properties } from '../util/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './dom/DomWrappers';

export class GroupContainer<D> extends DataDrivenComponentImpl<D, any> implements IsContainer {
  readonly isContainer: true = true;

  constructor(private dataNodeProps?: DataNodeProperties, private nativeProperties?: Properties) {
    super(DomWrappers.group(), dataNodeProps);
  }

  get id() {
    return this.nativeProperties && this.nativeProperties[NATIVE_PROPERTIES.ID];
  }

  setData(data: D) {
    this.dataNode.setData(data);
  }

  getData(): D {
    return this.dataNode.getData();
  }

  queryByName<C extends Component>(name: string) {
    return this.dataNode.getByName(name) as C[];
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }

  protected prepareCopy() {
    return new (this.constructor as {
      new(dataNodeProps?: DataNodeProperties): GroupContainer<D>
    })(this.dataNodeProps);
  }
}
