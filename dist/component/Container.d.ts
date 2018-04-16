import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
import { BindProperties } from './dom/DomBinder';
/**
 * Basic element.
 * @template E The type of DOM node.
 */
export declare class Container<D, E extends Element> extends DataDrivenComponentImpl<D, E> implements IsContainer {
    private element;
    private dataNodeProps;
    private bindProperties;
    private observationProperties;
    readonly isContainer: true;
    private domBinder;
    constructor(element: E, dataNodeProps?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): any;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected prepareCopy(): Container<D, E>;
}
