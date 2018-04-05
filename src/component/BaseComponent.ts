import { ObservationNode } from '../event/ObservationNode';
import { EventType, IsObservable, ObservationProperties } from '../event/types';
import { Component, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './dom/DomWrappers';

export type DomBasedComponent = BaseComponent<Node>;

export abstract class BaseComponent<N extends Node> implements Component {
  protected static getDataNode<N extends Node>(component: BaseComponent<N>) {
    return component.dataNode;
  }

  protected parent: DomBasedComponent;

  protected abstract readonly dataNode: DataNode;
  protected abstract readonly observationNode: ObservationNode;

  protected constructor(protected domWrapper: DomWrapper<N>) {
  }

  append(child: any) {
    if (child instanceof BaseComponent) {
      if (child.parent) {
        throw new Error('Element already appended');
      }

      child.parent = this;

      this.dataNode.append(child.dataNode);
      this.observationNode.append(child.observationNode);
      this.domWrapper.appendChild(child.domWrapper);
    } else {
      this.domWrapper.appendChild(`${child}`);
    }
  }

  remove(child: Component) {
    if (!(child instanceof BaseComponent)) {
      return;
    }

    if (child.parent !== this) {
      throw new Error('Impossible to detach a not child component');
    }

    delete child.parent;

    this.dataNode.remove(child.dataNode);
    this.observationNode.remove(child.observationNode);

    child.domWrapper.detach();
  }

  get domNode() {
    return this.domWrapper.domElement;
  }

  createObservable<P>(observedEvent?: EventType): IsObservable<P> {
    return this.observationNode.createObservable<P>(observedEvent);
  }
}

export abstract class DataDrivenComponentImpl<D, N extends Node> extends BaseComponent<N> implements IsDataDriven<D> {
  protected readonly dataNode: DataNode;
  protected readonly observationNode: ObservationNode;

  protected constructor(
    domWrapper: DomWrapper<N>,
    dataNodeProps: DataNodeProperties = {},
    observationProperties: ObservationProperties = {}
  ) {
    super(domWrapper);

    this.dataNode = new DataNode(dataNodeProps, (dataNodeProps.name || dataNodeProps.id) && this);
    this.observationNode = new ObservationNode(domWrapper.domElement, observationProperties, () => this.getData());
  }

  abstract getData(): D;

  abstract setData(data: D);
}
