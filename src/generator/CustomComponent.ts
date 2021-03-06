import { Component, IsContainer } from '../component//Components';
import { DomWrappers } from '../component//dom/DomWrappers';
import { DataDrivenComponent, DataDrivenComponentImpl } from '../component/BaseComponent';
import { NATIVE_PROPERTIES } from '../util/const';
import { PropertiesReader } from '../util/PropertiesReader';
import { Properties } from '../util/types';

export abstract class CustomComponent<D, N extends Node> extends DataDrivenComponentImpl<D, Node> implements IsContainer {
  readonly isContainer: true = true;

  protected constructor(private properties: Properties = {}) {
    super(DomWrappers.group(), PropertiesReader.create(properties).dataNodeProperties);

    const generated = this.generateComponent(properties);

    if (Array.isArray(generated)) {
      generated.forEach(component => this.appendImproper(component));
    } else {
      this.appendImproper(generated);
    }
  }

  get id() {
    return this.properties[NATIVE_PROPERTIES.ID];
  }

  setData(data: D) {
    this.dataNode.setData(data);
  }

  getData(): D {
    return this.dataNode.getData();
  }

  queryByName<C extends Component>(name: string) {
    return this.dataNode.getByName(name) as C[];
  }

  queryById<C extends Component>(id: string) {
    return this.dataNode.getById(id) as C;
  }

  protected abstract generateComponent(properties: Properties): DataDrivenComponent<D, N> | DataDrivenComponent<D, N>[];

  protected prepareCopy(): CustomComponent<D, N> {
    return new (this.constructor as {
      new(properties?: Properties): CustomComponent<D, N>
    })(this.properties);
  }

  private appendImproper(child) {
    this.improperChildren.add(child);
    this.append(child);
  }
}
