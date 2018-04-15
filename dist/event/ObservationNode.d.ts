import { DataNode } from '../component/DataNode';
import { EventType, IsObservable, ObservationProperties } from './types';
export declare class ObservationNode {
    private dataNode;
    private observationProperties;
    private parent;
    private children;
    private activeSubscriptions;
    constructor(dataNode: DataNode, observationProperties?: ObservationProperties);
    append(child: ObservationNode): void;
    remove(child: ObservationNode): void;
    createObservable<P>(observedType?: EventType): IsObservable<P>;
    private rebuildSubscription<P>(subscription);
    private rebuildSubscriptions();
    private rebuildDependentSubscriptions();
    private createEmitter(emitter?);
    private collectSubscriptions<P>(subscriber, observedType);
}
