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
    return this.getDataRecursive({} as D);
  }

  private getDataRecursive(model) {
    this.children.forEach((childDataNode, idx) => {
      const { name, component } = childDataNode;

      if (name && component) {
        model[name] = component.getData();
      } else {
        childDataNode.getDataRecursive(model);
      }
    });

    return model;
  }

  setData<D>(data: D) {
    this.setModelRecursive(data);
  }

  private setModelRecursive(data) {
    this.children.forEach((childDataNode, idx) => {
      const { name, component } = childDataNode;

      if (!name) {
        return childDataNode.setModelRecursive(data);
      }

      if (!component) {
        return childDataNode.setModelRecursive(data[name]);
      }

      component.setData(data[name]);
    });
  }

  getById(id: string): Component {
    if (this.id === id) {
      return this.component;
    }

    if (this.component && this.component.queryById) {
      return this.component.queryById(id);
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
      return this.component;
    }

    for (const dataNode of this.children.values()) {
      const component = dataNode.getByName(name);

      if (component) {
        return component;
      }
    }
  }
}
