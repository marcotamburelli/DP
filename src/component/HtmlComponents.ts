import { BaseComponent } from './BaseComponent';

export interface SimpleProperties {
  id?: string;
  name?: string;
}

export class HtmlElementComponent<T> extends BaseComponent<HTMLElement, T> {
  constructor(element: HTMLElement, properties: SimpleProperties = {}, private transformer?: (value: string) => T) {
    super(element, properties);
  }

  setModel(model: T) {
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

export class TextInputComponent<T> extends BaseComponent<HTMLInputElement, T> {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}, private transformer: (value: string) => T) {
    super(element, properties);
  }

  setModel(model: T) {
    this.element.value = model.toString();
  }

  getModel() {
    return this.transformer(this.element.value);
  }
}

export class CheckBoxInputComponent extends BaseComponent<HTMLInputElement, boolean> {
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

export class SelectComponent<T> extends BaseComponent<HTMLSelectElement, T[] | T> {
  constructor(element: HTMLSelectElement, properties: SimpleProperties = {}, private transformer: (value: string) => T) {
    super(element, properties);
  }

  setModel(model: T[] | T = []) {
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
    var model = [] as T[];
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
