import { DataDrivenComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { GroupContainer as ExtGroupContainer } from './component/GroupContainer';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { Listener } from './event/listener';
import { GenericObservable, Message } from './event/types';
import { CustomComponent } from './generator/CustomComponent';
import { ComponentGenerator } from './generator/generator';
import { HTML, Properties } from './util/types';
export declare namespace dp {
    type Definition = HTML | ((props: Properties, children?: any[]) => DataDrivenComponent<any, any>) | ComponentGenerator<any> | {
        new (): CustomComponent<any, any>;
    } | DomBasedComponent<any>;
    type Container<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D> & IsContainer;
    type ListContainer<D> = ExtListContainer<D>;
    type GroupContainer<D> = ExtGroupContainer<D>;
    type TextComponent<D> = ExtTextComponent<D>;
    type Component<D, N extends Node> = DomBasedComponent<N> & IsDataDriven<D>;
    const IDENTITY_BINDER: {
        get(v: any): any;
        set(v: any): any;
    };
    const INT_BINDER: {
        set: (n: any) => string;
        get: (v: any) => number;
    };
    const DATA_EVENT = "DATA_EVENT";
    const DATA_EMITTER: (eventType?: string) => {
        eventType: string;
    };
    function List<D>(props: Properties, children: any[]): ExtListContainer<D>;
    function Group<D>(props: Properties): ExtGroupContainer<D>;
    function Text<D>(props: Properties): TextComponent<D>;
    function define<C extends DomBasedComponent<any>>(definition: Definition, properties: Properties, ...children: any[]): C;
    function listen<P>(stream: GenericObservable<Message<P>>): Listener<P>;
}
