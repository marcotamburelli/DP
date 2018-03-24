import { Definition } from './Builder';
import { BaseComponent, DomBasedComponent } from './component/BaseComponent';
import { IsContainer, IsDataDriven } from './component/Components';
import { ListContainer as ExtListContainer } from './component/ListContainer';
import { TextComponent as ExtTextComponent } from './component/TextComponent';
import { Listener } from './event/listener';
import { GenericObservable, Message } from './event/types';
import { Properties } from './util/types';
export declare namespace dp {
    type Container<D, N extends Node> = BaseComponent<N> & IsDataDriven<D> & IsContainer;
    type ListContainer<D> = ExtListContainer<D>;
    type TextComponent = ExtTextComponent;
    type Component<D, N extends Node> = BaseComponent<N> & IsDataDriven<D>;
    function List<D>(props: Properties): ExtListContainer<D>;
    function Text(props: Properties): ExtTextComponent;
    function define<C extends DomBasedComponent>(definition: Definition, properties: Properties, ...children: any[]): C;
    function listen<P>(stream: GenericObservable<Message<P>>): Listener<P>;
}
