import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './dom/DomWrappers';

export class GroupContainer<D> extends DataDrivenComponentImpl<D, any> implements IsContainer {
  constructor(dataNodeProps?: DataNodeProperties) {
    super(DomWrappers.group(), dataNodeProps);
  }

  setData(data: D) {
    this.dataNode.setData(data);
  }

  getData() {
    return this.dataNode.getData();
  }

  queryByName<C extends Component>(name: string) {
    return this.dataNode.getByName(name) as C[];
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }
}
