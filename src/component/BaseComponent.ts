import { ObservationNode } from '../event/ObservationNode';
import { EventType, IsObservable, ObservationProperties } from '../event/types';
import { Component, HasDomNode, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './dom/DomWrappers';

export abstract class DomBasedComponent<N extends Node> implements Component, HasDomNode<N> {
  protected parent: DomBasedComponent<any>;
  protected children = [];

  protected abstract readonly observationNode: ObservationNode;
  protected abstract readonly domWrapper: DomWrapper<N>;

  get id() {
    return this.domWrapper.id;
  }

  append(child: any) {
    if (child instanceof DomBasedComponent) {
      if (child.parent) {
        throw new Error('Element already appended');
      }

      child.parent = this;

      this.observationNode.append(child.observationNode);
      this.domWrapper.appendChild(child.domWrapper);
    } else {
      this.domWrapper.appendChild(`${child}`);
    }

    this.children.push(child);
  }

  remove(child: Component) {
    if (!(child instanceof DomBasedComponent)) {
      return;
    }

    if (child.parent !== this) {
      throw new Error('Impossible to detach a not child component');
    }

    delete child.parent;

    this.observationNode.remove(child.observationNode);
    this.domWrapper.removeChild(child.domWrapper);

    const idx = this.children.indexOf(child);

    if (idx >= 0) {
      this.children.splice(idx, 1);
    }
  }

  get domNode(): N {
    return this.domWrapper.domElement;
  }

  createObservable<P>(observedEvent?: EventType): IsObservable<P> {
    return this.observationNode.createObservable<P>(observedEvent);
  }

  cloneComponent<C extends DomBasedComponent<N>>(deep = true) {
    const copy = this.prepareCopy() as C;

    deep && this.children.forEach(child => {
      if (child instanceof DomBasedComponent) {
        copy.append(child.cloneComponent());
      } else {
        copy.append(child);
      }
    });

    return copy;
  }

  protected abstract prepareCopy(): DomBasedComponent<N>;
}

export type DataDrivenComponent<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D>;

export abstract class DataDrivenComponentImpl<D, N extends Node> extends DomBasedComponent<N> implements IsDataDriven<D> {
  protected readonly dataNode: DataNode;
  protected readonly observationNode: ObservationNode;

  protected constructor(
    protected readonly domWrapper: DomWrapper<N>,
    dataNodeProps: DataNodeProperties = {},
    observationProperties: ObservationProperties = {}
  ) {
    super();

    this.dataNode = new DataNode(dataNodeProps, this);
    this.observationNode = new ObservationNode(this.dataNode, observationProperties);
  }

  append(child: any) {
    super.append(child);

    if (child instanceof DataDrivenComponentImpl) {
      this.dataNode.append(child.dataNode);
    }
  }

  remove(child: Component) {
    super.remove(child);

    if (child instanceof DataDrivenComponentImpl) {
      this.dataNode.remove(child.dataNode);
    }
  }

  abstract getData(): D;

  abstract setData(data: D);
}
