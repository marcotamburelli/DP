import { BaseComponent } from './BaseComponent';

export class HtmlElementComponent<T> extends BaseComponent<HTMLInputElement, T> {
  constructor(element: HTMLInputElement, id: string, name: string, private transformer: (value: string) => T) {
    super(element, { id, name });
  }

  setModel(model: T) {
    this.element.innerText = model.toString();
  }

  getModel() {
    return this.transformer(this.element.innerText);
  }
}

export class TextInputComponent<T> extends BaseComponent<HTMLInputElement, T> {
  constructor(element: HTMLInputElement, id: string, name: string, private transformer: (value: string) => T) {
    super(element, { id, name });
  }

  setModel(model: T) {
    this.element.value = model.toString();
  }

  getModel() {
    return this.transformer(this.element.value);
  }
}

export class CheckBoxInputComponent extends BaseComponent<HTMLInputElement, boolean> {
  constructor(element: HTMLInputElement, id: string, name: string) {
    super(element, { id, name });
  }

  setModel(model: boolean) {
    this.element.checked = model;
  }

  getModel() {
    return this.element.checked;
  }
}

export class MultiSelectComponent<T> extends BaseComponent<HTMLSelectElement, T[] | T> {
  constructor(element: HTMLSelectElement, id: string, name: string, private transformer: (value: string) => T) {
    super(element, { id, name });
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

      opt.selected = values[opt.value] === true;
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
