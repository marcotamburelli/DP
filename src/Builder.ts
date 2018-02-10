import { BaseComponent, ChildComponent, GenericComponent } from './component/BaseComponent';

export namespace Hello {
  type Holder = GenericComponent | string | ((props: Properties) => GenericComponent);
  interface Properties { [prop: string]: any; };
  type ChildDef = (ChildComponent | ChildComponent[]);

  function appendChildDef(parent: GenericComponent, child: ChildDef) {
    if (Array.isArray(child)) {
      child.forEach(c => parent.append(c));
    } else {
      parent.append(child);
    }
  }

  export function define(holder: Holder, properties: Properties, ...children: ChildDef[]) {
    if (holder instanceof BaseComponent) {
      var component = holder;
    } else if (typeof holder === 'function') {
      component = holder(properties);
    }

    children.forEach(child => appendChildDef(component, child));
  }
}
