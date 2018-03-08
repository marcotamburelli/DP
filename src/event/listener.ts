import { GenericObservable, Message, Subscription } from './types';

export type ProcessingFunction<P> = (payload: P) => (Listener<P> | void);

export class Listener<P> {
  private subscription: Subscription;
  private childListeners = new Map<ProcessingFunction<any>, Listener<any>>();
  private consumer = new Map<string, ProcessingFunction<P>>();

  static create<P>(stream: GenericObservable<Message<P>>) {
    return new Listener<P>(stream);
  }

  private constructor(private stream: GenericObservable<Message<P>>) {
    this.subscription = stream.subscribe({
      next: ({ eventType, payload }) => {
        const processingFunc = this.consumer.get(eventType);

        if (processingFunc) {
          this.childListeners.forEach(listener => listener && listener.dispose());

          const listener = processingFunc(payload);

          (listener instanceof Listener) && this.childListeners.set(processingFunc, listener);
        }
      },
      error: (e) => { },
      complete: () => { }
    });
  }

  dispose() {
    this.subscription && this.subscription.unsubscribe();
    this.childListeners.forEach(listener => listener && listener.dispose());
  }

  on(eventType: string) {
    return {
      execute: (func: ProcessingFunction<P>) => {
        this.consumer.set(eventType, func);
      }
    };
  }
}
