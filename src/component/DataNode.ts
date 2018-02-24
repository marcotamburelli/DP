import { Component, IsDataDriven } from './Components';

export interface DataNodeProperties {
  id?: string;
  name?: string;
}

export class DataNode {
  idx?: number;

  private childSeq = 0;
  private children: { [idx: number]: DataNode } = {};

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

    this.children[dataNode.idx] = dataNode;
  }

  remove(dataNode: DataNode) {
    if (dataNode.idx != null) {
      delete this.children[dataNode.idx];
      delete dataNode.idx;
    }
  }

  getData<D>() {
    return this.getDataRecursive({} as D);
  }

  private getDataRecursive(model) {
    Object.keys(this.children).forEach(idx => {
      const childDataNode = this.children[idx] as DataNode;
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
    Object.keys(this.children).forEach(idx => {
      const childDataNode = this.children[idx] as DataNode;
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

    for (const idx in this.children) {
      if (this.children.hasOwnProperty(idx)) {
        const component = (this.children[idx] as DataNode).getById(id);

        if (component) {
          return component;
        }
      }
    }
  }

  getByName(name: string) {
    if (this.name === name) {
      return this.component;
    }

    for (const idx in this.children) {
      if (this.children.hasOwnProperty(idx)) {
        const component = (this.children[idx] as DataNode).getByName(name);

        if (component) {
          return component;
        }
      }
    }
  }
}
