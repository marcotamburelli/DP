import { BaseComponent, DomBasedComponent } from './BaseComponent';
import { IsDataDriven } from './Components';
import { GroupContainer } from './GroupContainer';

export type ComponentGenerator<D> = () => DomBasedComponent & IsDataDriven<D>;

export const createGenerator = <D>(content: any[]): ComponentGenerator<D> => () => {
  if (content.length > 1) {
    const group = new GroupContainer<D>();

    content.forEach(child => {
      if (child instanceof BaseComponent) {
        group.append(child.cloneComponent());
      } else {
        group.append(child);
      }
    });

    return group;
  }

  const component = content[0];

  if (component instanceof BaseComponent) {
    return component.cloneComponent();
  }
};
