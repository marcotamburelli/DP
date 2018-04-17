import { Properties } from '../util/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
export declare class GroupContainer<D> extends DataDrivenComponentImpl<D, any> implements IsContainer {
    private dataNodeProps;
    private nativeProperties;
    readonly isContainer: true;
    constructor(dataNodeProps?: DataNodeProperties, nativeProperties?: Properties);
    readonly id: any;
    setData(data: D): void;
    getData(): D;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected prepareCopy(): GroupContainer<D>;
}
