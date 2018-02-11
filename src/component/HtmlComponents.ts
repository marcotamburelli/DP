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

export class TextInputComponent<M> extends BaseComponent<HTMLInputElement, M> implements HasModel<M> {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(element, properties);
  }

  setModel(model: M) {
    this.element.value = model.toString();
  }

  getModel() {
    return this.transformer(this.element.value);
  }
}

export class CheckBoxInputComponent extends BaseComponent<HTMLInputElement, boolean> implements HasModel<boolean> {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}) {
    super(element, properties);
  }

  setModel(model: boolean) {
    this.element.checked = model;
  }

  getModel() {
    return this.element.checked;
  }
}

export class SelectComponent<M> extends BaseComponent<HTMLSelectElement, M[] | M> implements HasModel<M[] | M> {
  constructor(element: HTMLSelectElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(element, properties);
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
