import { DomBasedComponent } from './component/BaseComponent';
import { Container } from './component/Container';
import { GroupContainer } from './component/GroupContainer';
import { CheckBoxInputComponent, HtmlElementComponent, RadioInputComponent, SelectComponent, TextInputComponent } from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { HTML, Properties } from './util/types';
export declare type Definition = HTML | ((props: Properties, children?: any[]) => DomBasedComponent) | DomBasedComponent;
export declare namespace Builder {
    function createComponent(tag: HTML, properties: Properties, hasChildren: boolean): Container<{}, HTMLElement> | HtmlElementComponent<string | number> | CheckBoxInputComponent<{}> | RadioInputComponent<string | number> | TextInputComponent<string | number> | SelectComponent<string | number>;
    function createList<D>(properties: Properties, children: any[]): ListContainer<D>;
    function createGroup<D>(properties: Properties): GroupContainer<D>;
    function createText<D>(properties: Properties): TextComponent<D>;
}
