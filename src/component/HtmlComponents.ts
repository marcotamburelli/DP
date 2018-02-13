import { MODEL_UPDATED } from '../event/Event';
import { BaseComponent } from './BaseComponent';
import { HasModel } from './types';

export interface SimpleProperties {
  id?: string;
  name?: string;
}

export class HtmlElementComponent<M> extends BaseComponent<HTMLElement, M> implements HasModel<M> {
  constructor(element: HTMLElement, properties: SimpleProperties = {}, private transformer?: (value: string) => M) {
    super(element, properties);
  }

  setModel(model: M) {
    if (this.scopeProperties.name) {
      this.element.innerText = model.toString();
    }
  }

  getModel() {
    if (this.scopeProperties.name) {
      return this.transformer(this.element.innerText);
    }
  }
}

abstract class NamedComponent<M> extends BaseComponent<HTMLInputElement | HTMLSelectElement, M> implements HasModel<M> {
  constructor(element: HTMLInputElement | HTMLSelectElement, properties: SimpleProperties = {}) {
    super(element, properties);
  }

  protected registerDomName(namespace: string, name: string) {
    this.element.name = `${namespace}.${name}`;
  }
}

export class TextInputComponent<M> extends NamedComponent<M>  {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(element, properties);

    element.addEventListener('keyup', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: M) {
    this.element.value = model.toString();
  }

  getModel() {
    return this.transformer(this.element.value);
  }
}

export class CheckBoxInputComponent extends NamedComponent<boolean> {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}) {
    super(element, properties);

    element.addEventListener('change', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: boolean) {
    (this.element as HTMLInputElement).checked = model;
  }

  getModel() {
    return (this.element as HTMLInputElement).checked;
  }
}

export class SelectComponent<M> extends BaseComponent<HTMLSelectElement, M[] | M> implements HasModel<M[] | M> {
  constructor(element: HTMLSelectElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(element, properties);

    element.addEventListener('select', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: M[] | M = []) {
    const { options } = this.element;

    var values = {} as { [index: string]: boolean };

    if (Array.isArray(model)) {
      for (const t of model) {
        values[t.toString()] = true;
      }
    } else {
      values[model.toString()] = true;
    }

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      opt.selected = (values[opt.value] === true);
    }
  }

  getModel() {
    var model = [] as M[];
    const { options } = this.element;

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      if (opt.selected) {
        model.push(this.transformer(opt.value));
      }
    }

    if (this.element.multiple) {
      return model;
    } else {
      return model[0];
    }
  }
}
