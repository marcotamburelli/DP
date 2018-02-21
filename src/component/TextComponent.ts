import { DataDrivenComponentImpl } from './BaseComponent';
import { DataNodeProperties } from './DataNode';
import { DomWrappers } from './DomWrappers';

export class TextComponent extends DataDrivenComponentImpl<string, Text>  {
  constructor(dataNodeProps?: DataNodeProperties) {
    super(DomWrappers.text(), dataNodeProps);
  }

  setData(data: string) {
    if (this.dataNode.name) {
      this.domWrapper.domElement.data = data;
    }
  }

  getData() {
    if (this.dataNode.name) {
      return this.domWrapper.domElement.data;
    }
  }
}
