import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
import { BindProperties, DomBinder } from './dom/DomBinder';
import { DomWrappers } from './dom/DomWrappers';

/**
 * Basic element.
 * @template E The type of DOM node.
 */
export class Container<D, E extends Element> extends DataDrivenComponentImpl<D, E> implements IsContainer {
  private domBinder: DomBinder;

  constructor(
    private element: E,
    private dataNodeProps?: DataNodeProperties,
    private bindProperties?: BindProperties,
    private observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element), dataNodeProps, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    this.domBinder.setTo(data, this.domNode);
    this.dataNode.setData(data);
  }

  getData() {
    return { ...this.domBinder.getFrom(this.domNode), ...this.dataNode.getData() };
  }

  queryByName<C extends Component>(name: string) {
    return this.dataNode.getByName(name) as C[];
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }

  protected prepareCopy() {
    return new (this.constructor as {
      new(
        element: E,
        properties: DataNodeProperties,
        bindProperties?: BindProperties,
        observationProperties?: ObservationProperties
      ): Container<D, E>
    })(
      this.element.cloneNode() as E,
      this.dataNodeProps,
      this.bindProperties,
      this.observationProperties
    );
  }
}
