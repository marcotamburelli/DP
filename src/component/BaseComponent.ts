import { Channel, Listener } from '../event/Channel';
import { BaseEvent, EventType } from '../event/Event';

interface NamesMap { [name: string]: GenericComponent; };
interface IdsMap { [id: string]: GenericComponent; };

export interface Scope {
  namespace: string;
  idsMap: IdsMap;
  namesMap: NamesMap;
  childScopes: { [index: string]: Scope };
}

export interface ScopeProperties {
  namespace?: string;
  id?: string;
  name?: string;
}

export type GenericComponent = BaseComponent<Element, any>;
export type ChildComponent = GenericComponent | string;

export abstract class BaseComponent<E extends Element, M> {
  protected parent: GenericComponent;

  private localScope: Scope;
  private channel = new Channel();

  protected constructor(protected element: E, protected scopeProperties: ScopeProperties = {}) {
    var { namespace } = scopeProperties;

    if (namespace) {
      this.localScope = { namespace, idsMap: {}, namesMap: {}, childScopes: {} };
    }

    this.registerInScope();
  }

  protected getScope(): Scope {
    if (this.localScope) {
      return this.localScope;
    }

    if (this.parent) {
      return this.parent.getScope();
    }
  }

  abstract setModel(model: M);

  abstract getModel();

  private registerInScope() {
    var scope = this.getScope();

    if (scope) {
      var { id, name } = this.scopeProperties;
      var { idsMap, namesMap } = scope;

      if (id) {
        idsMap[id] = this;
      }

      if (name) {
        namesMap[name] = this;
      }
    }
  }

  private unregisterInScope() {
    var scope = this.getScope();

    if (scope) {
      var { id, name } = this.scopeProperties;
      var { idsMap, namesMap } = scope;

      if (id) {
        delete idsMap[id];
      }

      if (name) {
        delete namesMap[name];
      }
    }
  }

  append(child: ChildComponent) {
    if (child instanceof BaseComponent) {
      child.parent = this;

      this.pullChildScope(child);
      this.element.appendChild(child.domNode);
      child.registerInScope();
    } else {
      this.element.appendChild(document.createTextNode(child));
    }
  }

  private pullChildScope(child: GenericComponent) {
    var scope = this.getScope();
    var childScope = child.localScope;

    if (childScope && scope) {
      scope.childScopes[childScope.namespace] = childScope;
    }
  }

  detach() {
    if (!this.parent) {
      return;
    }

    this.parent.detachChildScope(this);
    this.parent.element.removeChild(this.element);
    this.unregisterInScope();
  }

  private detachChildScope(child: GenericComponent) {
    var scope = this.getScope();
    var childScope = child.localScope;

    if (scope && childScope && childScope.namespace) {
      delete scope.childScopes[childScope.namespace];
    }
  }

  get domNode() {
    return this.element;
  }

  subscribeListener(eventType: EventType, listener: Listener) {
    return this.channel.subscribe(eventType, listener);
  }

  emitEvent<P>(event: BaseEvent<P>) {
    this.channel.emit(event);
  }
}
