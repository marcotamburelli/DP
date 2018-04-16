import { Component, IsContainer, IsDataDriven, IsList } from './Components';

export enum DataMappingBehavior { Named, Spread, Search }

export interface DataNodeProperties {
  name?: string;
  dataBehavior?: DataMappingBehavior;
}

export class DataNode {
  private parent: DataNode;
  private children = new Set<DataNode>();

  constructor(
    private dataNodeProperties: DataNodeProperties = {},
    public readonly component?: Component & IsDataDriven<any>
  ) {
  }

  get name() {
    return this.dataNodeProperties.name;
  }

  get dataBehavior() {
    return this.dataNodeProperties.dataBehavior || (this.name ? DataMappingBehavior.Named : DataMappingBehavior.Search);
  }

  append(dataNode: DataNode) {
    if (dataNode.parent != null) {
      throw new Error('Data node cannot be appended since it already has a parent.');
    }

    dataNode.parent = this;

    this.children.add(dataNode);
  }

  remove(dataNode: DataNode) {
    if (dataNode.parent === this) {
      this.children.delete(dataNode);

      delete dataNode.parent;
    }
  }

  getMinimalNamedComponent() {
    let dataNode: DataNode = this;
    let parentDataNode = dataNode.parent;

    while (true) {
      if (!parentDataNode) {
        break;
      }

      const { isContainer } = (dataNode.component || {}) as IsContainer;

      if (dataNode.name && isContainer) {
        break;
      }

      const { isList } = (parentDataNode.component || {}) as IsList;

      if (isList) {
        break;
      }

      dataNode = parentDataNode;
      parentDataNode = dataNode.parent;
    }

    return dataNode.component;
  }

  getData<D>() {
    return this.getDataRecursive({});
  }

  setData<D>(data: D) {
    this.setDataRecursive(data);
  }

  getById(id: string): Component {
    if (!id) {
      return;
    }

    if (this.component.id === id) {
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

  private getDataRecursive(data) {
    this.children.forEach((childDataNode) => {
      const { name, component, dataBehavior } = childDataNode;

      switch (dataBehavior) {
        case DataMappingBehavior.Named:
          if (data[name] == null) {
            data[name] = component.getData();
          }
          break;

        case DataMappingBehavior.Spread:
          const childData = component.getData() || {};

          Object.keys(childData).forEach(n => data[n] = childData[n]);
          break;

        case DataMappingBehavior.Search:
          childDataNode.getDataRecursive(data);
          break;
      }
    });

    return data;
  }

  private setDataRecursive(data) {
    this.children.forEach((childDataNode) => {
      const { name, component, dataBehavior } = childDataNode;

      switch (dataBehavior) {
        case DataMappingBehavior.Named:
          return component.setData(data[name]);

        case DataMappingBehavior.Spread:
          return component.setData(data);

        case DataMappingBehavior.Search:
          return childDataNode.setDataRecursive(data);
      }
    });
  }
}
