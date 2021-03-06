import { ComponentGenerator } from '../generator/generator';
import { Properties } from '../util/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsList } from './Components';
import { DataNodeProperties } from './DataNode';
export declare class ListContainer<D> extends DataDrivenComponentImpl<D[], any> implements IsList {
    private generator;
    private dataNodeProps;
    private nativeProperties;
    readonly isContainer: true;
    readonly isList: true;
    constructor(generator: ComponentGenerator<D>, dataNodeProps?: DataNodeProperties, nativeProperties?: Properties);
    readonly id: any;
    append(child: any): void;
    setData(data: D[]): void;
    getData(): D[];
    getChildCount(): number;
    getFirstChild<C extends Component>(): C;
    getLastChild<C extends Component>(): C;
    queryByIdx<C extends Component>(idx: number): C;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected prepareCopy(): ListContainer<D>;
}
