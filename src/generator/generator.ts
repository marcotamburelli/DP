import { DataDrivenComponent, DomBasedComponent } from '../component//BaseComponent';
import { Properties } from '../util/types';
import { CustomComponent } from './CustomComponent';

export const createGenerator = <D>(content: any[]): ComponentGenerator<D> => () => {
  return new class extends CustomComponent<D, Node> {
    constructor() {
      super();
    }

    protected generateComponent() {
      return content.map(child => child instanceof DomBasedComponent ? child.cloneComponent() : child);
    }
  }();
};

export type ComponentGenerator<D> = (properties?: Properties) => DataDrivenComponent<Node, D>;
export type ComponentsGenerator<D> = (properties?: Properties) => DataDrivenComponent<Node, D> | DataDrivenComponent<Node, D>[];
