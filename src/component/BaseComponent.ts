import { Channel, Listener, Subscription } from '../event/Channel';
import { BaseEvent, EventType } from '../event/Event';
import { HasChannel } from '../event/types';
import { Component, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './DomWrappers';

export type ChildComponent = BaseComponent<any> | string;
export type DomBasedComponent = BaseComponent<any>;

export abstract class BaseComponent<N extends Node> implements Component, HasChannel {
  private channel = new Channel();

  protected parentDomComponent: DomBasedComponent;

  protected abstract readonly dataNode: DataNode;

  protected constructor(protected domWrapper: DomWrapper<N>) {
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
    child.domWrapper.detach();
  }

  get domNode() {
    return this.domWrapper.domElement;
  }

  subscribeListener(eventType: EventType, listener: Listener): Subscription {
    return this.channel.subscribe(eventType, listener);
  }

  emitEvent<P>(event: BaseEvent<P>) {
    this.channel.emit(event);
  }
}

export abstract class DataDrivenComponentImpl<D, N extends Node> extends BaseComponent<N> implements IsDataDriven<D> {
  protected dataNode: DataNode;

  protected constructor(domWrapper: DomWrapper<N>, dataNodeProps: DataNodeProperties = { name: 'default' }) {
    super(domWrapper);

    this.dataNode = new DataNode(dataNodeProps, (dataNodeProps.name || dataNodeProps.id) && this);
  }

  abstract getData(): D;

  abstract setData(data: D);
}
