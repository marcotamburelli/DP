import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './DomWrappers';

/**
 * Basic element.
 * @template E The type of DOM node.
 */
export class Container<D, E extends Element> extends DataDrivenComponentImpl<D, E> implements IsContainer {
  constructor(element: E, dataNodeProps?: DataNodeProperties) {
    super(DomWrappers.simple(element), dataNodeProps);
  }

  setData(data: D) {
    this.dataNode.setData(data);
  }

  getData() {
    return this.dataNode.getData();
  }

  queryByName<C extends Component>(name: string) {
    return this.dataNode.getByName(name) as C;
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }
}
