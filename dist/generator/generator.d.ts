import { DataDrivenComponent } from '../component//BaseComponent';
import { Properties } from '../util/types';
export declare const createGenerator: <D>(content: any[]) => ComponentGenerator<D>;
export declare type ComponentGenerator<D> = (properties?: Properties) => DataDrivenComponent<D, Node>;
export declare type ComponentsGenerator<D> = (properties?: Properties) => DataDrivenComponent<D, Node> | DataDrivenComponent<D, Node>[];
