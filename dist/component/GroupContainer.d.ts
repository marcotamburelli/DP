import { DataDrivenComponentImpl } from './BaseComponent';
import { Component, IsContainer } from './Components';
import { DataNodeProperties } from './DataNode';
export declare class GroupContainer<D> extends DataDrivenComponentImpl<D, any> implements IsContainer {
    private dataNodeProps;
    constructor(dataNodeProps?: DataNodeProperties);
    setData(data: D): void;
    getData(): any;
    queryByName<C extends Component>(name: string): C[];
    queryById<C extends Component>(id: string): C;
    protected prepareCopy(): GroupContainer<D>;
}
