import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
/**
 * Basic element.
 * @template E The type of DOM node.
 */
export declare class Container<D, E extends Element> extends DataDrivenComponentImpl<D, E> implements IsContainer {
    constructor(element: E, dataNodeProps?: DataNodeProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): any;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
}
