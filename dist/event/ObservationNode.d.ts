import { EventType, IsObservable, ObservationProperties } from './types';
export declare class ObservationNode {
    private domNode;
    private observationProperties;
    private defaultEmitter;
    private parent;
    private idx?;
    private childSeq;
    private children;
    private activeSubscriptions;
    constructor(domNode?: Node, observationProperties?: ObservationProperties, defaultEmitter?: () => any);
    append(child: ObservationNode): void;
    remove(child: ObservationNode): void;
    createObservable<P>(observedType?: EventType): IsObservable<P>;
    private rebuildSubscription<P>(subscription);
    private rebuildSubscriptions();
    private rebuildDependentSubscriptions();
    private collectSubscriptions<P>(subscriber, observedType, defaultEmitter?);
}
