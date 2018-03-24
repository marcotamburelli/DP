import { ObservationNode } from '../event/ObservationNode';
import { EventType, IsObservable, ObservationProperties } from '../event/types';
import { Component, IsDataDriven } from './Components';
import { DataNode, DataNodeProperties } from './DataNode';
import { DomWrapper } from './DomWrappers';
export declare type DomBasedComponent = BaseComponent<Node>;
export declare abstract class BaseComponent<N extends Node> implements Component {
    protected domWrapper: DomWrapper<N>;
    protected parent: DomBasedComponent;
    protected readonly abstract dataNode: DataNode;
    protected readonly abstract observationNode: ObservationNode;
    protected static getDataNode<N extends Node>(component: BaseComponent<N>): DataNode;
    protected constructor(domWrapper: DomWrapper<N>);
    append(child: any): void;
    remove(child: Component): void;
    readonly domNode: N;
    createObservable<P>(observedEvent?: EventType): IsObservable<P>;
}
export declare abstract class DataDrivenComponentImpl<D, N extends Node> extends BaseComponent<N> implements IsDataDriven<D> {
    protected readonly dataNode: DataNode;
    protected readonly observationNode: ObservationNode;
    protected constructor(domWrapper: DomWrapper<N>, dataNodeProps?: DataNodeProperties, observationProperties?: ObservationProperties);
    abstract getData(): D;
    abstract setData(data: D): any;
}
