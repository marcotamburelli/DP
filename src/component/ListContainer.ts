import { BaseComponent, GenericComponent, ScopeProperties } from './BaseComponent';
import { IsContainer } from './Components';
import { Context } from './Context';
import { DomWrappers } from './DomWrappers';

export type ComponentGenerator<M> = ((model: M, idx?: number) => GenericComponent);

export class ListContainer<M> extends BaseComponent<M[], any> implements IsContainer {
  private children: { elementContext: Context<any>, child: GenericComponent }[];
  private idx = 0;

  constructor(scopeProperties: ScopeProperties = { namespace: 'default' }, private generator: ComponentGenerator<M>) {
    super(DomWrappers.array(), scopeProperties);

    this.children = [];
  }

  protected createContext(namespace: string) {
    return new Context(namespace, this.domWrapper);
  }

  protected integrateChildContext(child: GenericComponent) {
    const context = this.getContext();

    if (!context) {
      return;
    }

    const childContext = this.extractLocalContext(child);
    const elementContext = new Context<any>(`${this.scopeProperties.namespace}.${++this.idx}`);

    if (childContext) {
      elementContext.pushChildContext(childContext);
    } else {
      elementContext.register(this.extractScopeProperties(child) || {}, child);
    }

    context.pushChildContext(elementContext);
    this.children.push({ elementContext, child });
  }

  protected detachChildScope(child: GenericComponent) {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].child === child) {
        this.localContext.removeChildContext(this.children[i].elementContext.namespace);
        this.children.splice(i, 1);
      }
    }
  }

  setModel(model: M[]) {
    [...this.children].forEach(({ child }) => child.detach());

    model.forEach((m, i) => {
      const child = this.generator(m, i);

      this.append(child);
    });

    this.children.forEach(({ elementContext }, i) => elementContext.updateModel(model[i]));
  }

  getModel() {
    return this.children.map(({ elementContext }) => elementContext.extractModel<M>());
  }

  queryByName(name: string) {
    return this.getContext().getByName<M, GenericComponent>(name);
  }

  queryById(id: string) {
    return this.getContext().getById<M, GenericComponent>(id);
  }
}
