import { Container } from './component/Container';
import { GroupContainer } from './component/GroupContainer';
import { CheckBoxInputComponent, HtmlElementComponent, RadioInputComponent, SelectComponent, TextInputComponent } from './component/HtmlComponents';
import { ListContainer } from './component/ListContainer';
import { TextComponent } from './component/TextComponent';
import { CustomComponent } from './generator/CustomComponent';
import { ComponentGenerator } from './generator/generator';
import { HTML, Properties } from './util/types';
export declare namespace Builder {
    function createComponent(tag: HTML, properties: Properties, hasChildren: boolean): Container<{}, HTMLElement> | HtmlElementComponent<string | number> | CheckBoxInputComponent<{}> | RadioInputComponent<string | number> | TextInputComponent<string | number> | SelectComponent<string | number>;
    function createList<D>(properties: Properties, children: any[]): ListContainer<D>;
    function createGroup<D>(properties: Properties): GroupContainer<D>;
    function createText<D>(properties: Properties): TextComponent<D>;
    function createCustom<D>(generator: ComponentGenerator<D> | {
        new (): CustomComponent<D, any>;
    }, properties: Properties): CustomComponent<D, any>;
}
