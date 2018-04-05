import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties } from './dom/DomBinder';
export declare class TextComponent<D> extends DataDrivenComponentImpl<D, Text> {
    private domBinder;
    constructor(dataNodeProps?: DataNodeProperties, bindProperties?: BindProperties);
    setData(data: D): void;
    getData(): D;
}
