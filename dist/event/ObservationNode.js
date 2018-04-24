"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_observable_1 = require("symbol-observable");
class SubscriptionImpl {
    constructor(activeSubscriptions, subscriber, observerType) {
        this.activeSubscriptions = activeSubscriptions;
        this.subscriber = subscriber;
        this.observerType = observerType;
        this.innerSubscriptions = [];
        this.activeSubscriptions.add(this);
    }
    buildSubscription(creator) {
        this.innerSubscriptions.forEach(subscription => subscription());
        this.innerSubscriptions = creator(this.subscriber, this.observerType);
    }
    unsubscribe() {
        this.innerSubscriptions.forEach(subscription => subscription());
        this.activeSubscriptions.delete(this);
    }
}
class ObservationNode {
    constructor(dataNode, observationProperties = {}) {
        this.dataNode = dataNode;
        this.observationProperties = observationProperties;
        this.children = new Set();
        this.activeSubscriptions = new Set();
    }
    append(child) {
        if (child.parent != null) {
            throw new Error('Observation node cannot be appended since it already has a parent.');
        }
        child.parent = this;
        this.children.add(child);
        this.rebuildDependentSubscriptions();
    }
    remove(child) {
        if (child.parent === this) {
            this.children.delete(child);
            delete child.parent;
            this.rebuildDependentSubscriptions();
        }
    }
    createObservable(observedType) {
        return {
            subscribe: (subscriber) => this.rebuildSubscription(new SubscriptionImpl(this.activeSubscriptions, subscriber, observedType)),
            [symbol_observable_1.default]() { return this; }
        };
    }
    rebuildSubscription(subscription) {
        subscription.buildSubscription((subscriber, observedType) => this.collectSubscriptions(subscriber, observedType));
        return subscription;
    }
    rebuildSubscriptions() {
        this.activeSubscriptions.forEach(subscription => this.rebuildSubscription(subscription));
    }
    rebuildDependentSubscriptions() {
        var observationNode = this;
        while (observationNode) {
            observationNode.rebuildSubscriptions();
            observationNode = observationNode.parent;
        }
    }
    createEmitter(emitter) {
        if (emitter) {
            return emitter;
        }
        return () => this.dataNode.getMinimalNamedComponent().getData();
    }
    collectSubscriptions(subscriber, observedType) {
        const subscriptions = [];
        const { domNode } = this.dataNode.component;
        if (domNode) {
            Object.keys(this.observationProperties).map(domEvent => {
                const { emitter, eventType } = this.observationProperties[domEvent];
                if (observedType == null || observedType === eventType) {
                    const payloadCreator = this.createEmitter(emitter);
                    const handler = (e) => {
                        subscriber.next({
                            eventType,
                            payload: payloadCreator(e)
                        });
                    };
                    domNode.addEventListener(domEvent, handler);
                    subscriptions.push(() => domNode.removeEventListener(domEvent, handler));
                }
            });
        }
        const buffer = [];
        this.children.forEach(observationNode => buffer.push(observationNode.collectSubscriptions(subscriber, observedType)));
        const array = [].concat.apply(subscriptions, buffer);
        return array;
    }
}
exports.ObservationNode = ObservationNode;
