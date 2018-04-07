import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties, DomBinder } from './dom/DomBinder';
import { DomWrapper, DomWrappers } from './dom/DomWrappers';

export class HtmlElementComponent<D> extends DataDrivenComponentImpl<D, HTMLElement> {
  private domBinder: DomBinder;

  constructor(
    element: HTMLElement,
    properties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element), properties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    if (!this.dataNode.name) {
      return;
    }

    if (this.domBinder.isDefault()) {
      const set = this.domBinder.getDefaultBinder<D, string>().set;

      set && this.setDefaultValue(set(data));
    } else {
      this.domBinder.setTo(data, this.domNode);
    }
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    if (this.domBinder.isDefault()) {
      const get = this.domBinder.getDefaultBinder<D, string>().get;

      return get && get(this.getDefaultValue());
    } else {
      return this.domBinder.getFrom<D>(this.domNode);
    }
  }

  private setDefaultValue(value: string) {
    this.domWrapper.domElement.textContent = value;
  }

  private getDefaultValue() {
    return this.domWrapper.domElement.textContent;
  }
}

export class TextInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement | HTMLTextAreaElement>  {
  private domBinder: DomBinder;

  constructor(
    element: HTMLInputElement | HTMLTextAreaElement,
    properties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element) as DomWrapper<HTMLInputElement | HTMLTextAreaElement>, properties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    if (!this.dataNode.name) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, string>().set;

    if (set) {
      this.domWrapper.domElement.value = set(data);
    }
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, string>().get;

    return get && get(this.domWrapper.domElement.value);
  }
}

export class CheckBoxInputComponent<D> extends DataDrivenComponentImpl<D, HTMLInputElement> {
  private domBinder: DomBinder;

  constructor(
    element: HTMLInputElement,
    properties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element) as DomWrapper<HTMLInputElement>, properties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    if (!this.dataNode.name) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, boolean>().set;

    if (set) {
      this.domWrapper.domElement.checked = set(data);
    }
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, boolean>().get;

    return get && get(this.domWrapper.domElement.checked);
  }
}

export class SelectComponent<D> extends DataDrivenComponentImpl<D[] | D, HTMLSelectElement> {
  private domBinder: DomBinder;

  constructor(
    element: HTMLSelectElement,
    properties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element) as DomWrapper<HTMLSelectElement>, properties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D[] | D = []) {
    if (!this.dataNode.name) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, string>().set;

    if (set == null) {
      return;
    }

    const { options } = this.domWrapper.domElement;
    const values: { [index: string]: boolean } = {};

    if (Array.isArray(data)) {
      for (const t of data) {
        values[set(t)] = true;
      }
    } else {
      values[set(data)] = true;
    }

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      opt.selected = (values[opt.value] === true);
    }
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, string>().get;

    if (get == null) {
      return;
    }

    const data: D[] = [];
    const { options } = this.domWrapper.domElement;

    for (let i = 0; i < options.length; i++) {
      const opt = options.item(i);

      if (opt.selected) {
        data.push(get(opt.value));
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
  private domBinder: DomBinder;

  constructor(
    element: HTMLInputElement,
    properties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element) as DomWrapper<HTMLInputElement>, properties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    if (!this.dataNode.name) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, string>().set;

    if (set == null) {
      return;
    }

    const radioInput = this.domWrapper.domElement;

    radioInput.checked = (radioInput.value === set(data));
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, string>().get;

    if (get == null) {
      return;
    }

    const radioInput = this.domWrapper.domElement;

    if (radioInput.checked) {
      return get(radioInput.value);
    }
  }
}
