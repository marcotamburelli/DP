import { GenericObservable, Message } from './types';
export declare type ProcessingFunction<P> = (payload: P) => (Listener<P> | void);
export declare class Listener<P> {
    private stream;
    static create<P>(stream: GenericObservable<Message<P>>): Listener<P>;
    private subscription;
    private childListeners;
    private consumer;
    private constructor();
    dispose(): void;
    on(eventType: string): {
        execute: (func: ProcessingFunction<P>) => void;
    };
}
