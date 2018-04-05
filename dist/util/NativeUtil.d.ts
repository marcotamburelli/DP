import { Properties } from './types';
export declare namespace NativeUtil {
    function applyProperty(node: Node, {name, value}: {
        name: string;
        value: any;
    }): void;
    function extractProperty(node: Node, name: string): string | {
        [prop: string]: any;
    };
    function applyProperties(node: Node, properties: Properties): void;
}
