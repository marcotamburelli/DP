export declare const DEFAULT_BIND = "____DEFAULT";
export interface BindProperties {
    [name: string]: Binder<any, any>;
}
export interface Binder<D, V> {
    get?(str: V): D;
    set?(data: D): V;
}
export declare class DomBinder {
    private properties;
    static readonly IDENTITY_BINDER: {
        get(v: any): any;
        set(v: any): any;
    };
    static readonly INT_BINDER: {
        set: (n: any) => string;
        get: (v: any) => number;
    };
    static create(properties?: BindProperties): DomBinder;
    private names;
    private constructor();
    isDefault(): boolean;
    getDefaultBinder<D, V>(): Binder<D, V>;
    setTo<D>(data: D, node: Node): void;
    getFrom<D>(node: Node): D;
}
