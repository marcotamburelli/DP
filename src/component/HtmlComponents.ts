import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { DomWrapper, DomWrappers } from './DomWrappers';

export class HtmlElementComponent<D> extends DataDrivenComponentImpl<D, HTMLElement> {
  constructor(element: HTMLElement, properties: DataNodeProperties = {}, private transformer?: (value: string) => D) {
    super(DomWrappers.simple(element), properties);
  }

  setData(data: D) {
    if (this.dataNode.name) {
      this.domWrapper.domElement.textContent = data.toString();
    }
  }

  getData() {
    if (this.dataNode.name && this.transformer) {
      return this.transformer(this.domWrapper.domElement.textContent);
    }
  }
}

export class TextInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement>  {
  constructor(element: HTMLInputElement, properties: DataNodeProperties = {}, private transformer: (value: string) => D) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties);
  }

  setData(data: D) {
    this.domWrapper.domElement.value = data.toString();
  }

  getData() {
    return this.transformer(this.domWrapper.domElement.value);
  }
}

export class CheckBoxInputComponent extends DataDrivenComponentImpl<boolean, HTMLInputElement> {
  constructor(element: HTMLInputElement, properties: DataNodeProperties = {}) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties);
  }

  setData(data: boolean) {
    (this.domWrapper.domElement as HTMLInputElement).checked = data;
  }

  getData() {
    return (this.domWrapper.domElement as HTMLInputElement).checked;
  }
}

export class SelectComponent<D> extends DataDrivenComponentImpl<D[] | D, HTMLSelectElement> {
  constructor(element: HTMLSelectElement, properties: DataNodeProperties = {}, private transformer: (value: string) => D) {
    super(DomWrappers.input(element) as DomWrapper<HTMLSelectElement>, properties);
  }

  setData(data: D[] | D = []) {
    const { options } = this.domWrapper.domElement;

    var values = {} as { [index: string]: boolean };

    if (Array.isArray(data)) {
      for (const t of data) {
        values[t.toString()] = true;
      }
    } else {
      values[data.toString()] = true;
    }

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      opt.selected = (values[opt.value] === true);
    }
  }

  getData() {
    var data = [] as D[];
    const { options } = this.domWrapper.domElement;

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      if (opt.selected) {
        data.push(this.transformer(opt.value));
      }
    }

    if (this.domWrapper.domElement.multiple) {
      return data;
    } else {
      return data[0];
    }
  }
}
