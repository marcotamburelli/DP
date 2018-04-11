import { Properties } from '../util/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
import { ComponentGenerator } from './generator';
export declare class ListContainer<D> extends DataDrivenComponentImpl<D[], any> implements IsList {
    private generator;
    private dataNodeProps;
    private nativeProperties;
    constructor(generator: ComponentGenerator<D>, dataNodeProps?: DataNodeProperties, nativeProperties?: Properties);
    readonly id: any;
    append(child: any): void;
    setData(data: D[]): void;
    getData(): any[];
    getChildCount(): number;
    getFirstChild<C extends Component>(): C;
    getLastChild<C extends Component>(): C;
    queryByIdx<C extends Component>(idx: number): C;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected prepareCopy(): ListContainer<D>;
}
