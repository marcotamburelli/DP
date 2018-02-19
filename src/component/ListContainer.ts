import { BaseComponent, GenericComponent, ScopeProperties } from './BaseComponent';
import { IsList } from './Components';
import { Context } from './Context';
import { DomWrappers } from './DomWrappers';

export type ComponentGenerator<M> = ((model: M, idx?: number) => GenericComponent);

export class ListContainer<M> extends BaseComponent<M[], any> implements IsList {
  private childContextProperties: { elementContext: Context<any>, child: GenericComponent }[];
  private idx = 0;

  constructor(private generator: ComponentGenerator<M>, scopeProperties: ScopeProperties = {}) {
    super(DomWrappers.array(), scopeProperties);

    this.childContextProperties = [];
  }

  protected integrateChildContext(child: GenericComponent) {
    const context = this.getContext();

    if (!context) {
      return;
    }

    const childContext = this.extractLocalContextFrom(child);
    const elementContext = new Context<any>(`${this.scopeProperties.namespace}.${++this.idx}`);

    if (childContext) {
      elementContext.pushChildContext(childContext);
    } else {
      elementContext.register(this.extractScopeProperties(child) || {}, child);
    }

    context.pushChildContext(elementContext);
    this.childContextProperties.push({ elementContext, child });
  }

  protected detachChildScope(child: GenericComponent) {
    for (var i = 0; i < this.childContextProperties.length; i++) {
      if (this.childContextProperties[i].child === child) {
        this.localContext.removeChildContext(this.childContextProperties[i].elementContext.namespace);
        this.childContextProperties.splice(i, 1);
      }
    }
  }

  setModel(model: M[]) {
    if (!this.generator) {
      return;
    }

    [...this.childContextProperties].forEach(({ child }) => child.detach());

    model.forEach((m, i) => {
      const child = this.generator(m, i);

      this.append(child);
    });

    this.childContextProperties.forEach(({ child }, i) => child.setModel(model[i]));
  }

  getModel() {
    return this.childContextProperties.map(({ child }) => child.getModel());
  }

  queryByIdx(idx: number) {
    const childContextProp = this.childContextProperties[idx];

    return childContextProp && childContextProp.child;
  }

  queryById(id: string) {
    return this.getContext().getById<M, GenericComponent>(id);
  }
}
