import { GenericObservable, Message } from './types';
export declare type ProcessingFunction<P> = (payload: P) => (Listener<P> | void);
export declare class Listener<P> {
    private stream;
    private subscription;
    private childListeners;
    private consumer;
    static create<P>(stream: GenericObservable<Message<P>>): Listener<P>;
    private constructor();
    dispose(): void;
    on(eventType: string): {
        execute: (func: ProcessingFunction<P>) => void;
    };
}
