import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { BindProperties, DomBinder } from './dom/DomBinder';
import { DomWrappers } from './dom/DomWrappers';

export class TextComponent<D> extends DataDrivenComponentImpl<D, Text>  {
  private domBinder: DomBinder;

  constructor(dataNodeProps?: DataNodeProperties, bindProperties?: BindProperties) {
    super(DomWrappers.text(), dataNodeProps);

    this.domBinder = DomBinder.create(bindProperties);
  }

  setData(data: D) {
    if (!this.dataNode.name) {
      return;
    }

    const set = this.domBinder.getDefaultBinder<D, string>().set;

    if (set) {
      this.domWrapper.domElement.data = set(data);
    }
  }

  getData() {
    if (!this.dataNode.name) {
      return;
    }

    const get = this.domBinder.getDefaultBinder<D, string>().get;

    return get && get(this.domWrapper.domElement.data);
  }
}
