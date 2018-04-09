import { DomBasedComponent } from './BaseComponent';
import { IsDataDriven } from './Components';
export declare type ComponentGenerator<D> = () => DomBasedComponent & IsDataDriven<D>;
export declare const createGenerator: <D>(content: any[]) => ComponentGenerator<D>;
