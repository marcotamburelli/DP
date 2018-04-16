"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataMappingBehavior;
(function (DataMappingBehavior) {
    DataMappingBehavior[DataMappingBehavior["Named"] = 0] = "Named";
    DataMappingBehavior[DataMappingBehavior["Spread"] = 1] = "Spread";
    DataMappingBehavior[DataMappingBehavior["Search"] = 2] = "Search";
})(DataMappingBehavior = exports.DataMappingBehavior || (exports.DataMappingBehavior = {}));
class DataNode {
    constructor(dataNodeProperties = {}, component) {
        this.dataNodeProperties = dataNodeProperties;
        this.component = component;
        this.children = new Set();
    }
    get name() {
        return this.dataNodeProperties.name;
    }
    get dataBehavior() {
        return this.dataNodeProperties.dataBehavior || (this.name ? DataMappingBehavior.Named : DataMappingBehavior.Search);
    }
    append(dataNode) {
        if (dataNode.parent != null) {
            throw new Error('Data node cannot be appended since it already has a parent.');
        }
        dataNode.parent = this;
        this.children.add(dataNode);
    }
    remove(dataNode) {
        if (dataNode.parent === this) {
            this.children.delete(dataNode);
            delete dataNode.parent;
        }
    }
    getMinimalNamedComponent() {
        let dataNode = this;
        let parentDataNode = dataNode.parent;
        while (true) {
            if (!parentDataNode) {
                break;
            }
            const { isContainer } = (dataNode.component || {});
            if (dataNode.name && isContainer) {
                break;
            }
            const { isList } = (parentDataNode.component || {});
            if (isList) {
                break;
            }
            dataNode = parentDataNode;
            parentDataNode = dataNode.parent;
        }
        return dataNode.component;
    }
    getData() {
        return this.getDataRecursive({});
    }
    setData(data) {
        this.setDataRecursive(data);
    }
    getById(id) {
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
    getByName(name) {
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
    getDataRecursive(data) {
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
    setDataRecursive(data) {
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
exports.DataNode = DataNode;
