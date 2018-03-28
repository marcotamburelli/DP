import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
export declare class HtmlElementComponent<D> extends DataDrivenComponentImpl<D, HTMLElement> {
    private transformer;
    constructor(element: HTMLElement, properties?: DataNodeProperties, observationProperties?: ObservationProperties, transformer?: (value: string) => D);
    setData(data: D): void;
    getData(): D;
}
export declare class TextInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement | HTMLTextAreaElement> {
    private transformer;
    constructor(element: HTMLInputElement | HTMLTextAreaElement, properties?: DataNodeProperties, observationProperties?: ObservationProperties, transformer?: (value: string) => D);
    setData(data: D): void;
    getData(): D;
}
export declare class CheckBoxInputComponent extends DataDrivenComponentImpl<boolean, HTMLInputElement> {
    constructor(element: HTMLInputElement, properties?: DataNodeProperties, observationProperties?: ObservationProperties);
    setData(data: boolean): void;
    getData(): boolean;
}
export declare class SelectComponent<D> extends DataDrivenComponentImpl<D[] | D, HTMLSelectElement> {
    private transformer;
    constructor(element: HTMLSelectElement, properties?: DataNodeProperties, observationProperties?: ObservationProperties, transformer?: (value: string) => D);
    setData(data?: D[] | D): void;
    getData(): D | D[];
}
export declare class RadioInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement> {
    private transformer;
    constructor(element: HTMLInputElement, properties?: DataNodeProperties, observationProperties?: ObservationProperties, transformer?: (value: string) => D);
    setData(data: D): void;
    getData(): D;
}
