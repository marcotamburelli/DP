import { Channel, Listener } from '../event/Channel';
import { BaseEvent, EventType } from '../event/Event';
import { HasChannel } from '../event/types';
import { Context, HasModel } from './Context';
import { DomWrapper } from './DomWrappers';

export interface ScopeProperties {
  namespace?: string;
  id?: string;
  name?: string;
}

export type GenericComponent = BaseComponent<any, Element>;
export type ChildComponent = GenericComponent | string;

export abstract class BaseComponent<M, E extends Element> implements HasChannel, HasModel<M> {
  protected parent: GenericComponent;

  private localContext: Context<E>;
  private channel = new Channel();

  protected constructor(protected domWrapper: DomWrapper<E>, protected scopeProperties: ScopeProperties = {}) {
    var { namespace } = scopeProperties;

    if (namespace) {
      this.localContext = new Context(namespace, domWrapper);

      this.localContext.register(scopeProperties, this);
    }
  }

  protected getContext(): Context<Element> {
    if (this.localContext) {
      return this.localContext;
    }

    if (this.parent) {
      return this.parent.getContext();
    }
  }

  abstract setModel(model: M);

  abstract getModel(): M;

  append(child: ChildComponent) {
    if (child instanceof BaseComponent) {
      if (child.parent) {
        throw new Error('Element already appended');
      }

      child.parent = this;

      this.integrateChildContext(child);
      this.domWrapper.appendChild(child.domWrapper);
    } else {
      this.domWrapper.appendChild(child);
    }
  }

  private integrateChildContext(child: GenericComponent) {
    var context = this.getContext();

    if (!context) {
      return;
    }

    var childContext = child.localContext;

    if (childContext) {
      context.pushChildContext(childContext);
    } else {
      context.register(child.scopeProperties, child);
    }
  }

  detach() {
    if (!this.parent) {
      return;
    }

    this.parent.detachChildScope(this);
    this.domWrapper.detach();
  }

  private detachChildScope(child: GenericComponent) {
    var context = this.getContext();

    if (!context) {
      return;
    }

    var childScope = child.localContext;

    if (childScope) {
      context.removeChildContext(childScope.namespace);
    } else {
      context.unregister(child.scopeProperties);
    }
  }

  get domNode() {
    return this.domWrapper.domElement;
  }

  subscribeListener(eventType: EventType, listener: Listener) {
    return this.channel.subscribe(eventType, listener);
  }

  emitEvent<P>(event: BaseEvent<P>) {
    this.channel.emit(event);
  }
}
