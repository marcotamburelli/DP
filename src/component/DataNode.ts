import { Component, IsDataDriven } from './Components';

export interface DataNodeProperties {
  id?: string;
  name?: string;
}

export class DataNode {
  private idx?: number;

  private childSeq = 0;
  private children = new Map<number, DataNode>();

  constructor(private dataNodeProperties: DataNodeProperties = {}, private component?: Component & IsDataDriven<any>) {
  }

  get name() {
    return this.dataNodeProperties.name;
  }

  get id() {
    return this.dataNodeProperties.id;
  }

  append(dataNode: DataNode) {
    if (dataNode.idx != null) {
      throw new Error('Data node cannot be appended since it already has a parent.');
    }

    dataNode.idx = ++this.childSeq;

    this.children.set(dataNode.idx, dataNode);
  }

  remove(dataNode: DataNode) {
    if (dataNode.idx != null) {
      this.children.delete(dataNode.idx);

      delete dataNode.idx;
    }
  }

  getData<D>() {
    return this.getDataRecursive({});
  }

  setData<D>(data: D) {
    this.setDataRecursive(data);
  }

  getById(id: string): Component {
    if (this.id === id) {
      return this.component;
    }

    for (const dataNode of this.children.values()) {
      const component = dataNode.getById(id);

      if (component) {
        return component;
      }
    }
  }

  getByName(name: string) {
    if (this.name === name) {
      return [this.component];
    }

    var components = [];

    for (const dataNode of this.children.values()) {
      const componentsByName = dataNode.getByName(name);

      if (componentsByName) {
        components = components.concat(componentsByName);
      }
    }

    return components;
  }

  private getDataRecursive(model) {
    this.children.forEach((childDataNode) => {
      const { name, component } = childDataNode;

      if (name && component) {
        if (model[name] == null) {
          model[name] = component.getData();
        }
      } else {
        childDataNode.getDataRecursive(model);
      }
    });

    return model;
  }

  private setDataRecursive(data) {
    this.children.forEach((childDataNode) => {
      const { name, component } = childDataNode;

      if (!name) {
        return childDataNode.setDataRecursive(data);
      }

      if (!component) {
        return childDataNode.setDataRecursive(data[name]);
      }

      component.setData(data[name]);
    });
  }
}
