import { Properties } from '../util/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties } from './dom/DomBinder';
export declare class TextComponent<D> extends DataDrivenComponentImpl<D, Text> {
    private dataNodeProps;
    private bindProperties;
    private nativeProperties;
    private domBinder;
    constructor(dataNodeProps?: DataNodeProperties, bindProperties?: BindProperties, nativeProperties?: Properties);
    readonly id: any;
    setData(data: D): void;
    getData(): D;
    protected prepareCopy(): TextComponent<D>;
}
