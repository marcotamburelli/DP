import { BaseComponent, ChildComponent, GenericComponent, ScopeProperties, Scope } from './BaseComponent';

/**
 * Basic element.
 * @template E The type of DOM node.
 * @template M The type of component model.
 */
export class ScopedComponent<E extends Element, M> extends BaseComponent<E, M> {

  private static searchByNameInScope(scope: Scope, name: string) {
    return ScopedComponent.searchInScope(scope, (s) => {
      if (!s) {
        return;
      }

      var { namesMap } = s;

      return namesMap[name];
    });
  }

  private static searchByIdInScope(scope: Scope, id: string) {
    return ScopedComponent.searchInScope(scope, (s) => {
      if (!s) {
        return;
      }

      var { idsMap } = s;

      return idsMap[id];
    });
  }

  private static searchInScope(scope: Scope, extract: (scope: Scope) => GenericComponent) {
    if (!scope) {
      return;
    }

    var component = extract(scope);

    if (component) {
      return component;
    }

    const { childScopes } = scope;

    if (childScopes) {
      for (const namespace in childScopes) {
        if (childScopes.hasOwnProperty(namespace)) {
          component = ScopedComponent.searchInScope(childScopes[namespace], extract);

          if (component) {
            return component;
          }
        }
      }
    }
  }

  private static scopeToModel<M>(scope: Scope, model = {} as M) {
    if (!scope) {
      return model;
    }

    var namesMap = scope.namesMap;

    for (const name in namesMap) {
      if (namesMap.hasOwnProperty(name)) {
        model[name] = namesMap[name].getModel();
      }
    }

    const { childScopes } = scope;

    if (childScopes) {
      for (const namespace in childScopes) {
        if (childScopes.hasOwnProperty(namespace)) {
          ScopedComponent.scopeToModel(childScopes[namespace], model);
        }
      }
    }

    return model;
  }

  constructor(element: E, scopeProperties: ScopeProperties = { namespace: 'default' }) {
    super(element, scopeProperties);
  }

  setModel(model: M) {
    for (const name in model) {
      if (model.hasOwnProperty(name)) {
        var component = this.queryByName(name);

        component && component.setModel(model[name]);
      }
    }
  }

  getModel() {
    return ScopedComponent.scopeToModel(this.getScope());
  }

  queryByName(name: string) {
    return ScopedComponent.searchByNameInScope(this.getScope(), name);
  }

  queryById(id: string) {
    return ScopedComponent.searchByIdInScope(this.getScope(), id);
  }
}
