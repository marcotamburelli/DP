import { Component, IsContainer } from '../component//Components';
import { DataDrivenComponent, DataDrivenComponentImpl } from '../component/BaseComponent';
import { Properties } from '../util/types';
export declare abstract class CustomComponent<D, N extends Node> extends DataDrivenComponentImpl<D, Node> implements IsContainer {
    private properties;
    readonly isContainer: boolean;
    protected constructor(properties?: Properties);
    readonly id: any;
    setData(data: D): void;
    getData(): D;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected abstract generateComponent(properties: Properties): DataDrivenComponent<D, N> | DataDrivenComponent<D, N>[];
    protected prepareCopy(): CustomComponent<D, N>;
}
