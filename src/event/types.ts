import { Listener } from './Channel';
import { BaseEvent, EventType } from './Event';

export interface HasChannel {
  subscribeListener(eventType: EventType, listener: Listener);

  emitEvent<P>(event: BaseEvent<P>);
}
