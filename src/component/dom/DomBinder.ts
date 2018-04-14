import { NativeUtil } from '../../util/NativeUtil';

export const DEFAULT_BIND = '____DEFAULT';
export interface BindProperties { [name: string]: Binder<any, any>; }

export interface Binder<D, V> {
  get?(str: V): D;
  set?(data: D): V;
}

export class DomBinder {
  static readonly IDENTITY_BINDER = {
    get(v) { return v; },
    set(v) { return v; }
  };

  static readonly INT_BINDER = {
    set: (n) => n == null ? '' : `${n}`,
    get: (v) => parseInt(v)
  };

  static create(properties: BindProperties = {}) {
    if (properties[DEFAULT_BIND]) {
      return new DomBinder({ ...properties });
    } else {
      return new DomBinder({ ...properties, [DEFAULT_BIND]: DomBinder.IDENTITY_BINDER });
    }
  }

  private names: string[];

  private constructor(private properties: BindProperties) {
    this.names = Object.keys(properties).filter(name => name !== DEFAULT_BIND);
  }

  isDefault() {
    return this.names.length === 0 && this.getDefaultBinder() != null;
  }

  getDefaultBinder<D, V>(): Binder<D, V> {
    return this.properties[DEFAULT_BIND];
  }

  setTo<D>(data: D, node: Node) {
    this.names
      .filter(name => this.properties[name].set != null)
      .forEach(name => {
        NativeUtil.applyProperty(node, { name, value: this.properties[name].set(data[name]) });
      });
  }

  getFrom<D>(node: Node) {
    return this.names
      .filter(name => this.properties[name].get != null)
      .reduce((data, name) => ({ ...data, [name]: this.properties[name].get(NativeUtil.extractProperty(node, name)) }), {}) as D;
  }
}
