import { Properties } from './types';
export declare namespace NativeUtil {
    function applyProperty(element: Element, {name, value}: {
        name: string;
        value: any;
    }): void;
    function extractProperty(element: Element, name: string): string | {
        [prop: string]: any;
    };
    function applyProperties(element: Element, properties: Properties): void;
}
