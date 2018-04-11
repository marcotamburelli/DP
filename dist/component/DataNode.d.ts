import { Component, IsDataDriven } from './Components';
export declare enum DataMappingBehavior {
    Named = 0,
    Spread = 1,
    Search = 2,
}
export interface DataNodeProperties {
    name?: string;
    dataBehavior?: DataMappingBehavior;
}
export declare class DataNode {
    private dataNodeProperties;
    private component;
    private parent;
    private children;
    constructor(dataNodeProperties?: DataNodeProperties, component?: Component & IsDataDriven<any>);
    readonly name: string;
    readonly dataBehavior: DataMappingBehavior;
    append(dataNode: DataNode): void;
    remove(dataNode: DataNode): void;
    getData<D>(): any;
    setData<D>(data: D): void;
    getById(id: string): Component;
    getByName(name: string): any[];
    private getDataRecursive(data);
    private setDataRecursive(data);
}
