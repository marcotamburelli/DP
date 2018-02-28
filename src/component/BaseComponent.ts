import { EventType, ObservationNode, ObservationProperties } from '../event/ObservationNode';
import { Component, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './DomWrappers';

export type ChildComponent = BaseComponent<Node> | string;
export type DomBasedComponent = BaseComponent<Node>;

export abstract class BaseComponent<N extends Node> implements Component {
  protected parentDomComponent: DomBasedComponent;

  protected abstract readonly dataNode: DataNode;
  protected readonly observationNode: ObservationNode;

  protected constructor(
    protected domWrapper: DomWrapper<N>,
    protected observationProperties: ObservationProperties = {}
  ) {
    this.observationNode = new ObservationNode(domWrapper.domElement, observationProperties);
  }

  get parent() {
    return this.parentDomComponent;
  }

  append(child: ChildComponent) {
    if (child instanceof BaseComponent) {
      if (child.parentDomComponent) {
        throw new Error('Element already appended');
      }

      child.parentDomComponent = this;

      this.dataNode.append(child.dataNode);
      this.observationNode.append(child.observationNode);
      this.domWrapper.appendChild(child.domWrapper);
    } else {
      this.domWrapper.appendChild(child);
    }
  }

  remove(child: DomBasedComponent) {
    if (child.parent !== this) {
      throw new Error('Impossible to detach a not child component');
    }

    delete child.parentDomComponent;

    this.dataNode.remove(child.dataNode);
    this.observationNode.remove(child.observationNode);

    child.domWrapper.detach();
  }

  get domNode() {
    return this.domWrapper.domElement;
  }

  createObservable(observedEvent: EventType) {
    return this.observationNode.createObservable(observedEvent);
  }
}

export abstract class DataDrivenComponentImpl<D, N extends Node> extends BaseComponent<N> implements IsDataDriven<D> {
  protected dataNode: DataNode;

  protected constructor(
    domWrapper: DomWrapper<N>,
    dataNodeProps: DataNodeProperties = {},
    observationProperties: ObservationProperties = {}
  ) {
    super(domWrapper, observationProperties);

    this.dataNode = new DataNode(dataNodeProps, (dataNodeProps.name || dataNodeProps.id) && this);
  }

  abstract getData(): D;

  abstract setData(data: D);
}
