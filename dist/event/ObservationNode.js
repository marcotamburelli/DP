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
    buildSubscription(func) {
        this.innerSubscriptions.forEach(subscription => subscription());
        this.innerSubscriptions = func(this.subscriber, this.observerType);
    }
    unsubscribe() {
        this.innerSubscriptions.forEach(subscription => subscription());
        this.activeSubscriptions.delete(this);
    }
}
class ObservationNode {
    constructor(domNode, observationProperties = {}, defaultEmitter) {
        this.domNode = domNode;
        this.observationProperties = observationProperties;
        this.defaultEmitter = defaultEmitter;
        this.childSeq = 0;
        this.children = new Map();
        this.activeSubscriptions = new Set();
    }
    append(child) {
        if (child.idx != null) {
            throw new Error('Observation node cannot be appended since it already has a parent.');
        }
        child.idx = ++this.childSeq;
        child.parent = this;
        this.children.set(child.idx, child);
        this.rebuildDependentSubscriptions();
    }
    remove(child) {
        if (child.idx != null) {
            this.children.delete(child.idx);
            delete child.idx;
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
    collectSubscriptions(subscriber, observedType, defaultEmitter = this.defaultEmitter) {
        const subscriptions = [];
        if (this.domNode) {
            Object.keys(this.observationProperties).map(domEvent => {
                const { emitter, eventType } = this.observationProperties[domEvent];
                if (observedType == null || observedType === eventType) {
                    const handler = (e) => subscriber.next({
                        eventType,
                        payload: (emitter || defaultEmitter || (() => null))(e)
                    });
                    this.domNode.addEventListener(domEvent, handler);
                    subscriptions.push(() => this.domNode.removeEventListener(domEvent, handler));
                }
            });
        }
        const buffer = [];
        this.children.forEach(observationNode => buffer.push(observationNode.collectSubscriptions(subscriber, observedType, defaultEmitter)));
        const array = [].concat.apply(subscriptions, buffer);
        return array;
    }
}
exports.ObservationNode = ObservationNode;
