import { Component, IsDataDriven } from './Components';
export interface DataNodeProperties {
    id?: string;
    name?: string;
}
export declare class DataNode {
    private dataNodeProperties;
    private component;
    private idx?;
    private childSeq;
    private children;
    constructor(dataNodeProperties?: DataNodeProperties, component?: Component & IsDataDriven<any>);
    readonly name: string;
    readonly id: string;
    append(dataNode: DataNode): void;
    remove(dataNode: DataNode): void;
    getData<D>(): any;
    setData<D>(data: D): void;
    getById(id: string): Component;
    getByName(name: string): any[];
    private getDataRecursive(model);
    private setDataRecursive(data);
}
