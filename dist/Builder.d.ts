import { DomBasedComponent } from './component/BaseComponent';
import { Container } from './component/Container';
import { CheckBoxInputComponent, HtmlElementComponent, RadioInputComponent, SelectComponent, TextInputComponent } from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { HTML, Properties } from './util/types';
export declare type Definition = HTML | ((props: Properties) => DomBasedComponent) | DomBasedComponent;
export declare namespace Builder {
    function createComponent(tag: HTML, properties: Properties, hasChildren: boolean): CheckBoxInputComponent | Container<{}, HTMLElement> | HtmlElementComponent<string | number> | RadioInputComponent<string | number> | TextInputComponent<string | number> | SelectComponent<string | number>;
    function createList<D>(properties: Properties): ListContainer<D>;
    function createText(properties: Properties): TextComponent;
}
