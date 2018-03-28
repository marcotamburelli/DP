export interface DomWrapper<N extends Node> {
    readonly domElement?: N;
    appendChild<F extends Node>(child: DomWrapper<F> | string): any;
    provideParent<P extends Node>(parent: DomWrapper<P>): any;
    detach(): any;
    registerDomId(namespace: string, id: string): any;
    registerDomName(namespace: string, name: string): any;
}
export declare namespace DomWrappers {
    function simple<E extends Element>(element: E): DomWrapper<E>;
    function input(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): DomWrapper<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    function array(): DomWrapper<Node>;
    function text(str?: string): DomWrapper<Text>;
}
