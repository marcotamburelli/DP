import { BaseEvent, EventType } from './Event';

export interface Subscription {
  channel: Channel;
  eventType: EventType;
  id: string;

  unsubscribe();
}

export type Listener = (payload) => void;

interface SubscriptionsMap {
  [eventType: string]: {
    [id: string]: Listener
  };
}

export class Channel {
  private sequence: number = 0;
  private subscriptionsMap: SubscriptionsMap = {};

  emit<P>(event: BaseEvent<P>) {
    var listeners = this.subscriptionsMap[event.type];

    Object.keys(listeners).forEach(id => setTimeout(listeners[id](event.payload)));
  }

  subscribe(eventType: EventType, listener: Listener) {
    var id = (++this.sequence).toString();

    (this.subscriptionsMap[eventType] || (this.subscriptionsMap[eventType] = {}))[id] = listener;

    return {
      channel: this,
      id,
      eventType,
      unsubscribe: () => this.clearSubscription(eventType, id)
    } as Subscription;
  }

  private clearSubscription(eventType: string, id: string) {
    var typeBased = this.subscriptionsMap[eventType];

    if (typeBased) {
      delete typeBased[id];
    }
  }
}
