import Symbol_observable from 'symbol-observable';

import { EventType, IsObservable, ObservationProperties, Subscriber, Subscription } from './types';

class SubscriptionImpl<P> implements Subscription {
  private innerSubscriptions: (() => void)[] = [];

  constructor(private activeSubscriptions: Set<Subscription>, private subscriber: Subscriber<P>, private observerType?: string) {
    this.activeSubscriptions.add(this);
  }

  buildSubscription(func: (subscriber: Subscriber<P>, observerType?: string) => (() => void)[]) {
    this.innerSubscriptions.forEach(subscription => subscription());
    this.innerSubscriptions = func(this.subscriber, this.observerType);
  }

  unsubscribe(): void {
    this.innerSubscriptions.forEach(subscription => subscription());
    this.activeSubscriptions.delete(this);
  }
}

export class ObservationNode {
  private parent: ObservationNode;
  private idx?: number;

  private childSeq = 0;
  private children = new Map<number, ObservationNode>();

  private activeSubscriptions = new Set<SubscriptionImpl<any>>();

  constructor(private domNode?: Node, private observationProperties: ObservationProperties = {}, private defaultEmitter?: () => any) { }

  append(child: ObservationNode) {
    if (child.idx != null) {
      throw new Error('Observation node cannot be appended since it already has a parent.');
    }

    child.idx = ++this.childSeq;
    child.parent = this;

    this.children.set(child.idx, child);

    this.rebuildDependentSubscriptions();
  }

  remove(child: ObservationNode) {
    if (child.idx != null) {
      this.children.delete(child.idx);

      delete child.idx;
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

  private collectSubscriptions<P>(
    subscriber: Subscriber<P>,
    observedType: EventType,
    defaultEmitter = this.defaultEmitter
  ): (() => void)[] {
    var subscriptions: (() => void)[] = [];

    if (this.domNode) {
      Object.keys(this.observationProperties).map(domEvent => {
        const { emitter, eventType } = this.observationProperties[domEvent];

        if (observedType == null || observedType === eventType) {
          const handler = (e: Event) => subscriber.next({
            eventType,
            payload: (emitter || defaultEmitter || (() => null))(e) as P
          });

          this.domNode.addEventListener(domEvent, handler);

          subscriptions.push(() => this.domNode.removeEventListener(domEvent, handler));
        }
      });
    }

    const buffer: (() => void)[][] = [];

    this.children.forEach(observationNode => buffer.push(observationNode.collectSubscriptions(subscriber, observedType, defaultEmitter)));

    const array = [].concat.apply(subscriptions, buffer);
    return array;
  }
}
