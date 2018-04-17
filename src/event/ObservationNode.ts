import Symbol_observable from 'symbol-observable';

import { HasDomNode } from '../component/Components';
import { DataNode } from '../component/DataNode';
import { EventType, IsObservable, ObservationProperties, Subscriber, Subscription } from './types';

class SubscriptionImpl<P> implements Subscription {
  private innerSubscriptions: (() => void)[] = [];

  constructor(private activeSubscriptions: Set<Subscription>, private subscriber: Subscriber<P>, private observerType?: string) {
    this.activeSubscriptions.add(this);
  }

  buildSubscription(creator: (subscriber: Subscriber<P>, observerType?: string) => (() => void)[]) {
    this.innerSubscriptions.forEach(subscription => subscription());
    this.innerSubscriptions = creator(this.subscriber, this.observerType);
  }

  unsubscribe(): void {
    this.innerSubscriptions.forEach(subscription => subscription());
    this.activeSubscriptions.delete(this);
  }
}

export class ObservationNode {
  private parent: ObservationNode;

  private children = new Set<ObservationNode>();

  private activeSubscriptions = new Set<SubscriptionImpl<any>>();

  constructor(private dataNode: DataNode, private observationProperties: ObservationProperties = {}) { }

  append(child: ObservationNode) {
    if (child.parent != null) {
      throw new Error('Observation node cannot be appended since it already has a parent.');
    }

    child.parent = this;

    this.children.add(child);

    this.rebuildDependentSubscriptions();
  }

  remove(child: ObservationNode) {
    if (child.parent === this) {
      this.children.delete(child);

      delete child.parent;

      this.rebuildDependentSubscriptions();
    }
  }

  createObservable<P>(observedType?: EventType): IsObservable<P> {
    return {
      subscribe: (subscriber: Subscriber<P>) => this.rebuildSubscription<P>(
        new SubscriptionImpl(this.activeSubscriptions, subscriber, observedType)
      ),
      [Symbol_observable]() { return this; }
    };
  }

  private rebuildSubscription<P>(subscription: SubscriptionImpl<P>) {
    subscription.buildSubscription((subscriber, observedType) => this.collectSubscriptions(subscriber, observedType));

    return subscription;
  }

  private rebuildSubscriptions() {
    this.activeSubscriptions.forEach(subscription => this.rebuildSubscription(subscription));
  }

  private rebuildDependentSubscriptions() {
    var observationNode: ObservationNode = this;

    while (observationNode) {
      observationNode.rebuildSubscriptions();
      observationNode = observationNode.parent;
    }
  }

  private createEmitter(emitter?: (e?: Event) => any) {
    if (emitter) {
      return emitter;
    }

    return () => this.dataNode.getMinimalNamedComponent().getData();
  }

  private collectSubscriptions<P>(subscriber: Subscriber<P>, observedType: EventType): (() => void)[] {
    const subscriptions: (() => void)[] = [];
    const { domNode } = this.dataNode.component as HasDomNode<any>;

    if (domNode) {
      Object.keys(this.observationProperties).map(domEvent => {
        const { emitter, eventType } = this.observationProperties[domEvent];

        if (observedType == null || observedType === eventType) {
          const payloadCreator = this.createEmitter(emitter);

          const handler = (e: Event) => {
            subscriber.next({
              eventType,
              payload: payloadCreator(e) as P
            });
          };

          domNode.addEventListener(domEvent, handler);

          subscriptions.push(() => domNode.removeEventListener(domEvent, handler));
        }
      });
    }

    const buffer: (() => void)[][] = [];

    this.children.forEach(observationNode => buffer.push(observationNode.collectSubscriptions(subscriber, observedType)));

    const array = [].concat.apply(subscriptions, buffer);
    return array;
  }
}
