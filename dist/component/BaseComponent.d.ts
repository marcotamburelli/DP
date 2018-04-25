import { ObservationNode } from '../event/ObservationNode';
import { EventType, IsObservable, ObservationProperties } from '../event/types';
import { Component, HasDomNode, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './dom/DomWrappers';
export declare abstract class DomBasedComponent<N extends Node> implements Component, HasDomNode<N> {
    protected parent: DomBasedComponent<any>;
    protected children: any[];
    protected readonly abstract observationNode: ObservationNode;
    protected readonly abstract domWrapper: DomWrapper<N>;
    readonly id: string;
    append(child: any): void;
    remove(child: Component): void;
    readonly domNode: N;
    createObservable<P>(observedEvent?: EventType): IsObservable<P>;
    cloneComponent<C extends DomBasedComponent<N>>(deep?: boolean): C;
    protected abstract prepareCopy(): DomBasedComponent<N>;
}
export declare type DataDrivenComponent<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D>;
export declare abstract class DataDrivenComponentImpl<D, N extends Node> extends DomBasedComponent<N> implements IsDataDriven<D> {
    protected readonly domWrapper: DomWrapper<N>;
    protected readonly dataNode: DataNode;
    protected readonly observationNode: ObservationNode;
    protected constructor(domWrapper: DomWrapper<N>, dataNodeProps?: DataNodeProperties, observationProperties?: ObservationProperties);
    append(child: any): void;
    remove(child: Component): void;
    abstract getData(): D;
    abstract setData(data: D): any;
}
