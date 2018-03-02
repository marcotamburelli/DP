import Symbol_observable from 'symbol-observable';

export type EventType = string;

export interface ObservationProperties {
  [domEvent: string]: {
    eventType: EventType;

    emitter(e: Event): any;
  };
}

export interface Message<P> {
  eventType: string;
  payload: P;
}

export interface Subscriber<P> {
  next(value: Message<P>);
  error(err: Error);
  complete(value?: Message<P>);
}

export interface IsObservable<P> {
  [x: string]: ((subscriber: Subscriber<P>) => {
    unsubscribe(): void;
  }) | (() => any);
  subscribe: (subscriber: Subscriber<P>) => {
    unsubscribe(): void;
  };
}

export class ObservationNode {
  private idx?: number;

  private childSeq = 0;
  private children: { [idx: number]: ObservationNode } = {};

  constructor(private domNode?: Node, private observationProperties: ObservationProperties = {}) { }

  append(dataNode: ObservationNode) {
    if (dataNode.idx != null) {
      throw new Error('Observation node cannot be appended since it already has a parent.');
    }

    dataNode.idx = ++this.childSeq;

    this.children[dataNode.idx] = dataNode;
  }

  remove(dataNode: ObservationNode) {
    if (dataNode.idx != null) {
      delete this.children[dataNode.idx];
      delete dataNode.idx;
    }
  }

  createObservable<P>(observedType?: EventType): IsObservable<P> {
    return {
      subscribe: (subscriber: Subscriber<P>) => {
        const subscriptions = this.collectSubscriptions(subscriber, observedType);

        return {
          unsubscribe() {
            subscriptions.forEach(subscription => subscription());
          }
        };
      },
      [Symbol_observable]() { return this; }
    };
  }

  private collectSubscriptions<P>(subscriber: Subscriber<P>, observedType?: EventType): (() => void)[] {
    var subscriptions: (() => void)[] = [];

    if (this.domNode) {
      Object.keys(this.observationProperties).map(domEvent => {
        const { emitter, eventType } = this.observationProperties[domEvent];

        if (observedType == null || observedType === eventType) {
          const handler = (e: Event) => subscriber.next({ eventType, payload: emitter(e) as P });

          this.domNode.addEventListener(domEvent, handler);

          subscriptions.push(() => this.domNode.removeEventListener(domEvent, handler));
        }
      });
    }

    return [].concat.apply(
      subscriptions,
      Object.keys(this.children).map(
        idx => (this.children[idx] as ObservationNode).collectSubscriptions(subscriber, observedType)
      )
    );
  }
}
