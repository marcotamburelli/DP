import Symbol_observable from 'symbol-observable';

export type EventType = string;

export interface ObservationProperties {
  [domEvent: string]: {
    eventType: EventType;

    emitter(): { payload: any; };
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

  createObservable(observedType: EventType) {
    return {
      [Symbol_observable]: () => {
        return {
          subscribe: (observer) => {
            const subscriptions = this.collectSubscriptions(observedType, observer);

            return {
              unsubscribe() {
                subscriptions.forEach(subscription => subscription());
              }
            };
          },
          [Symbol_observable]() { return this; }
        };
      }
    };
  }

  private collectSubscriptions(observedType: EventType, observer): (() => void)[] {
    var subscriptions: (() => void)[] = [];

    if (this.domNode) {
      Object.keys(this.observationProperties).map(domEvent => {
        const { emitter, eventType } = this.observationProperties[domEvent];

        if (observedType === eventType) {
          const handler = (e: Event) => observer.next({ e, payload: emitter() });

          this.domNode.addEventListener(domEvent, handler);

          subscriptions.push(() => this.domNode.removeEventListener(domEvent, handler));
        }
      });
    }

    return [].concat.apply(
      subscriptions,
      Object.keys(this.children).map(
        idx => (this.children[idx] as ObservationNode).collectSubscriptions(observedType, observer)
      )
    );
  }
}
