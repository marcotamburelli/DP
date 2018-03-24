import { Properties } from './types';
export declare namespace NativeUtil {
    function applyClass(element: HTMLElement, classProp: string): void;
    function applyStyle(element: HTMLElement, style: {
        [prop: string]: string;
    } | string): void;
    function applyProperties(element: HTMLElement, properties: Properties): void;
}
