import { Listener, Subscription } from './event/Channel';
import { EventType } from './event/Event';
import { HasChannel } from './event/types';

export class UseCase {
  private subscriptions: Subscription[];

  constructor(private actors: HasChannel[]) {
    this.subscriptions = [];
  }

  listen(eventType: EventType) {
    return {
      from: (actor: HasChannel) => this.from(eventType, actor)
    };
  }

  private from(eventType: EventType, actor: HasChannel) {
    if (this.actors.indexOf(actor) === -1) {
      throw new Error('Invalid actor');
    }

    return {
      then: (listener: Listener) => this.then(eventType, actor, listener)
    };
  }

  private then(eventType: EventType, actor: HasChannel, listener: Listener) {
    this.subscriptions.push(actor.subscribeListener(eventType, listener));
  }

  exit() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
