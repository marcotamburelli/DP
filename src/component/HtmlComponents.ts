import { BaseComponent } from './BaseComponent';
import { DomWrapper, DomWrappers } from './DomWrappers';

export interface SimpleProperties {
  id?: string;
  name?: string;
}

export class HtmlElementComponent<M> extends BaseComponent<M, HTMLElement>  {
  constructor(element: HTMLElement, properties: SimpleProperties = {}, private transformer?: (value: string) => M) {
    super(DomWrappers.simple(element), properties);
  }

  setModel(model: M) {
    if (this.scopeProperties.name) {
      this.domWrapper.domElement.innerText = model.toString();
    }
  }

  getModel() {
    if (this.scopeProperties.name) {
      return this.transformer(this.domWrapper.domElement.innerText);
    }
  }
}

export class TextInputComponent<M> extends BaseComponent<M, HTMLInputElement>  {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties);

    // domWrapper.domElement.addEventListener('keyup', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: M) {
    this.domWrapper.domElement.value = model.toString();
  }

  getModel() {
    return this.transformer(this.domWrapper.domElement.value);
  }
}

export class CheckBoxInputComponent extends BaseComponent<boolean, HTMLInputElement> {
  constructor(element: HTMLInputElement, properties: SimpleProperties = {}) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties);

    // element.addEventListener('change', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: boolean) {
    (this.domWrapper.domElement as HTMLInputElement).checked = model;
  }

  getModel() {
    return (this.domWrapper.domElement as HTMLInputElement).checked;
  }
}

export class SelectComponent<M> extends BaseComponent<M[] | M, HTMLSelectElement>  {
  constructor(element: HTMLSelectElement, properties: SimpleProperties = {}, private transformer: (value: string) => M) {
    super(DomWrappers.input(element) as DomWrapper<HTMLSelectElement>, properties);

    // element.addEventListener('select', () => this.emitEvent({ type: MODEL_UPDATED, payload: this.getModel() }));
  }

  setModel(model: M[] | M = []) {
    const { options } = this.domWrapper.domElement;

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
    const { options } = this.domWrapper.domElement;

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      if (opt.selected) {
        model.push(this.transformer(opt.value));
      }
    }

    if (this.domWrapper.domElement.multiple) {
      return model;
    } else {
      return model[0];
    }
  }
}
