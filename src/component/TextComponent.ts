import { BaseComponent, ScopeProperties } from './BaseComponent';
import { DomWrappers } from './DomWrappers';

export class TextComponent extends BaseComponent<string, Text> {
  constructor(scopeProperties: ScopeProperties = {}) {
    super(DomWrappers.text(), scopeProperties);
  }

  setModel(model: string) {
    if (this.scopeProperties.name) {
      this.domWrapper.domElement.data = model;
    }
  }

  getModel() {
    if (this.scopeProperties.name) {
      return this.domWrapper.domElement.data;
    }
  }
}
