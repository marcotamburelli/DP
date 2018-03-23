export type EventType = string;

export interface Subscription {
  unsubscribe(): void;
}

export interface Message<P> {
  eventType: string;
  payload: P;
}

export interface GenericSubscriber<M> {
  next(value: M): any;
  error(err: Error): any;
  complete(value?: M): any;
}

export interface GenericObservable<M> {
  subscribe: (subscriber: GenericSubscriber<M>) => Subscription;
}

export interface ObservationProperties {
  [domEvent: string]: {
    eventType: EventType;

    emitter?(e: Event): any;
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

export interface IsObservable<M> {
  [x: string]: ((subscriber: Subscriber<M>) => {
    unsubscribe(): void;
  }) | (() => any);
  subscribe(subscriber: Subscriber<M>): Subscription;
}
