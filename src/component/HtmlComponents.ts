import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { DomWrapper, DomWrappers } from './DomWrappers';

function stringValue(x) {
  if (x == null) {
    return '';
  } else {
    return x.toString();
  }
}

export class HtmlElementComponent<D> extends DataDrivenComponentImpl<D, HTMLElement> {
  constructor(
    element: HTMLElement,
    properties: DataNodeProperties = {},
    observationProperties?: ObservationProperties,
    private transformer?: (value: string) => D
  ) {
    super(DomWrappers.simple(element), properties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.name) {
      this.domWrapper.domElement.textContent = stringValue(data);
    }
  }

  getData() {
    if (this.dataNode.name && this.transformer) {
      return this.transformer(this.domWrapper.domElement.textContent);
    }
  }
}

export class TextInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement | HTMLTextAreaElement>  {
  constructor(
    element: HTMLInputElement | HTMLTextAreaElement,
    properties: DataNodeProperties = {},
    observationProperties?: ObservationProperties,
    private transformer?: (value: string) => D
  ) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement | HTMLTextAreaElement>, properties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.name) {
      this.domWrapper.domElement.value = stringValue(data);
    }
  }

  getData() {
    if (this.dataNode.name && this.transformer) {
      return this.transformer(this.domWrapper.domElement.value);
    }
  }
}

export class CheckBoxInputComponent extends DataDrivenComponentImpl<boolean, HTMLInputElement> {
  constructor(element: HTMLInputElement, properties: DataNodeProperties = {}, observationProperties?: ObservationProperties) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties, observationProperties);
  }

  setData(data: boolean) {
    if (this.dataNode.name) {
      (this.domWrapper.domElement as HTMLInputElement).checked = !!data;
    }
  }

  getData() {
    if (this.dataNode.name) {
      return (this.domWrapper.domElement as HTMLInputElement).checked;
    }
  }
}

export class SelectComponent<D> extends DataDrivenComponentImpl<D[] | D, HTMLSelectElement> {
  constructor(
    element: HTMLSelectElement,
    properties: DataNodeProperties = {},
    observationProperties?: ObservationProperties,
    private transformer?: (value: string) => D
  ) {
    super(DomWrappers.input(element) as DomWrapper<HTMLSelectElement>, properties, observationProperties);
  }

  setData(data: D[] | D = []) {
    if (!this.dataNode.name) {
      return;
    }

    const { options } = this.domWrapper.domElement;
    const values: { [index: string]: boolean } = {};

    if (Array.isArray(data)) {
      for (const t of data) {
        values[t.toString()] = true;
      }
    } else {
      values[stringValue(data)] = true;
    }

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      opt.selected = (values[opt.value] === true);
    }
  }

  getData() {
    if (!this.dataNode.name || !this.transformer) {
      return;
    }

    const data = [] as D[];
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

export class RadioInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement>  {
  constructor(
    element: HTMLInputElement,
    properties: DataNodeProperties = {},
    observationProperties?: ObservationProperties,
    private transformer?: (value: string) => D
  ) {
    super(DomWrappers.input(element) as DomWrapper<HTMLInputElement>, properties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.name) {
      const radioInput = this.domWrapper.domElement;

      radioInput.checked = (radioInput.value === stringValue(data));
    }
  }

  getData() {
    if (this.dataNode.name && this.transformer) {
      const radioInput = this.domWrapper.domElement;

      if (radioInput.checked) {
        return this.transformer(radioInput.value);
      }
    }
  }
}
