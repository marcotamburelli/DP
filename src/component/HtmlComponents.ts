import { ObservationProperties } from '../event/types';
import { DataDrivenComponentImpl } from './BaseComponent';
import { DataMappingBehavior, DataNodeProperties } from './DataNode';
import { BindProperties, DomBinder } from './dom/DomBinder';
import { DomWrappers } from './dom/DomWrappers';

abstract class HtmlComponent<D, N extends Element> extends DataDrivenComponentImpl<D, N> {
  protected domBinder: DomBinder;

  constructor(
    private element: N,
    private dataNodeProperties: DataNodeProperties = {},
    private bindProperties?: BindProperties,
    private observationProperties?: ObservationProperties
  ) {
    super(DomWrappers.simple(element), dataNodeProperties, observationProperties);

    this.domBinder = DomBinder.create(bindProperties);
  }

  protected prepareCopy<C extends HtmlComponent<D, N>>() {
    return new (this.constructor as {
      new(
        element: N,
        dataNodeProperties: DataNodeProperties,
        bindProperties?: BindProperties,
        observationProperties?: ObservationProperties
      ): C
    })(
      this.element.cloneNode() as N,
      this.dataNodeProperties,
      this.bindProperties,
      this.observationProperties
    );
  }
}

export class HtmlElementComponent<D> extends HtmlComponent<D, HTMLElement> {
  constructor(
    element: HTMLElement,
    dataNodeProperties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(element, dataNodeProperties, bindProperties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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

export class TextInputComponent<D> extends HtmlComponent<D, HTMLInputElement | HTMLTextAreaElement>  {
  constructor(
    element: HTMLInputElement | HTMLTextAreaElement,
    dataNodeProperties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(element, dataNodeProperties, bindProperties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, string>().set;

    if (set) {
      this.domWrapper.domElement.value = set(data);
    }
  }

  getData() {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, string>().get;

    return get && get(this.domWrapper.domElement.value);
  }
}

export class CheckBoxInputComponent<D> extends HtmlComponent<D, HTMLInputElement> {
  constructor(
    element: HTMLInputElement,
    dataNodeProperties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(element, dataNodeProperties, bindProperties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, boolean>().set;

    if (set) {
      this.domWrapper.domElement.checked = set(data);
    }
  }

  getData() {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, boolean>().get;

    return get && get(this.domWrapper.domElement.checked);
  }
}

export class SelectComponent<D> extends HtmlComponent<D[] | D, HTMLSelectElement> {
  constructor(
    element: HTMLSelectElement,
    dataNodeProperties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(element, dataNodeProperties, bindProperties, observationProperties);
  }

  setData(data: D[] | D = []) {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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

export class RadioInputComponent<D> extends HtmlComponent<D, HTMLInputElement>  {
  constructor(
    element: HTMLInputElement,
    dataNodeProperties: DataNodeProperties = {},
    bindProperties?: BindProperties,
    observationProperties?: ObservationProperties
  ) {
    super(element, dataNodeProperties, bindProperties, observationProperties);
  }

  setData(data: D) {
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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
    if (this.dataNode.dataBehavior === DataMappingBehavior.Search) {
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
