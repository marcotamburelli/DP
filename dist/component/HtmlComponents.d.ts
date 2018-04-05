import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties } from './dom/DomBinder';
export declare class HtmlElementComponent<D> extends DataDrivenComponentImpl<D, HTMLElement> {
    private domBinder;
    constructor(element: HTMLElement, properties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
    private setDefaultValue(value);
    private getDefaultValue();
}
export declare class TextInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement | HTMLTextAreaElement> {
    private domBinder;
    constructor(element: HTMLInputElement | HTMLTextAreaElement, properties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
export declare class CheckBoxInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement> {
    private domBinder;
    constructor(element: HTMLInputElement, properties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
export declare class SelectComponent<D> extends DataDrivenComponentImpl<D[] | D, HTMLSelectElement> {
    private domBinder;
    constructor(element: HTMLSelectElement, properties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data?: D[] | D): void;
    getData(): D | D[];
}
export declare class RadioInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement> {
    private domBinder;
    constructor(element: HTMLInputElement, properties?: DataNodeProperties, bindProperties?: BindProperties, observationProperties?: ObservationProperties);
    setData(data: D): void;
    getData(): D;
}
