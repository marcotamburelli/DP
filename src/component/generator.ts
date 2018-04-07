import { DomBasedComponent } from './BaseComponent';
import { IsDataDriven } from './Components';

export type ComponentGenerator<D> = ((data: D, idx?: number) => DomBasedComponent & IsDataDriven<D>);

export function createGenerator(content: any[]) {

}
