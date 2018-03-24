import { DataDrivenComponentImpl, DomBasedComponent } from './BaseComponent';
import { Component, IsDataDriven, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
export declare type ComponentGenerator<D> = ((data: D, idx?: number) => DomBasedComponent & IsDataDriven<D>);
export declare class ListContainer<M> extends DataDrivenComponentImpl<M[], any> implements IsList {
    private generator;
    private children;
    constructor(generator: ComponentGenerator<M>, dataNodeProps?: DataNodeProperties);
    append(child: any): void;
    remove(child: DomBasedComponent): void;
    setData(data: M[]): void;
    getData(): any[];
    getChildCount(): number;
    getFirstChild<C extends Component>(): C;
    getLastChild<C extends Component>(): C;
    queryByIdx<C extends Component>(idx: number): C;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
}
