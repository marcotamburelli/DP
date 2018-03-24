import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
export declare class TextComponent extends DataDrivenComponentImpl<string, Text> {
    constructor(dataNodeProps?: DataNodeProperties);
    setData(data: string): void;
    getData(): string;
}
