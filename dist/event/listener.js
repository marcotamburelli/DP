"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(stream) {
        this.stream = stream;
        this.childListeners = new Map();
        this.consumer = new Map();
        this.subscription = stream.subscribe({
            next: ({ eventType, payload }) => {
                const processingFunc = this.consumer.get(eventType);
                if (processingFunc) {
                    this.childListeners.forEach(childListener => childListener && childListener.dispose());
                    const listener = processingFunc(payload);
                    (listener instanceof Listener) && this.childListeners.set(processingFunc, listener);
                }
            },
            error: (e) => { },
            complete: () => { }
        });
    }
    static create(stream) {
        return new Listener(stream);
    }
    dispose() {
        this.subscription && this.subscription.unsubscribe();
        this.childListeners.forEach(listener => listener && listener.dispose());
    }
    on(eventType) {
        return {
            execute: (func) => {
                this.consumer.set(eventType, func);
            }
        };
    }
}
exports.Listener = Listener;
