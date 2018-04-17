import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties, DomBinder } from './dom/DomBinder';
export declare abstract class HtmlComponent<D, N extends Element> extends DataDrivenComponentImpl<D, N> {
    private element;
    private dataNodeProperties;
    private bindProperties;
    private observationProperties;
    protected domBinder: DomBinder;
    constructor(element: N, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    protected prepareCopy<C extends HtmlComponent<D, N>>(): C;
}
export declare class HtmlElementComponent<D> extends HtmlComponent<D, HTMLElement> {
    constructor(element: HTMLElement, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
    private setDefaultValue(value);
    private getDefaultValue();
}
export declare class TextInputComponent<D> extends HtmlComponent<D, HTMLInputElement | HTMLTextAreaElement> {
    constructor(element: HTMLInputElement | HTMLTextAreaElement, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
export declare class CheckBoxInputComponent<D> extends HtmlComponent<D, HTMLInputElement> {
    constructor(element: HTMLInputElement, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
export declare class SelectComponent<D> extends HtmlComponent<D[] | D, HTMLSelectElement> {
    constructor(element: HTMLSelectElement, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data?: D[] | D): void;
    getData(): D[] | D;
}
export declare class RadioInputComponent<D> extends HtmlComponent<D, HTMLInputElement> {
    constructor(element: HTMLInputElement, dataNodeProperties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
