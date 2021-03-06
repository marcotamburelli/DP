export interface DomWrapper<N extends Node> {
    parentDomWrapper: DomWrapper<any>;
    readonly domElement?: N;
    id: string;
    appendChild<F extends Node>(child: DomWrapper<F> | string): any;
    provideParent<P extends Node>(parent: DomWrapper<P>): any;
    removeChild(child: DomWrapper<any>): any;
    clone(): DomWrapper<N>;
}
export declare namespace DomWrappers {
    function simple<E extends Element>(element: E): DomWrapper<E>;
    function group(): DomWrapper<Node>;
    function text(str?: string): DomWrapper<Text>;
}
