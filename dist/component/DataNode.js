"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DataNode {
    constructor(dataNodeProperties = {}, component) {
        this.dataNodeProperties = dataNodeProperties;
        this.component = component;
        this.childSeq = 0;
        this.children = new Map();
    }
    get name() {
        return this.dataNodeProperties.name;
    }
    get id() {
        return this.dataNodeProperties.id;
    }
    append(dataNode) {
        if (dataNode.idx != null) {
            throw new Error('Data node cannot be appended since it already has a parent.');
        }
        dataNode.idx = ++this.childSeq;
        this.children.set(dataNode.idx, dataNode);
    }
    remove(dataNode) {
        if (dataNode.idx != null) {
            this.children.delete(dataNode.idx);
            delete dataNode.idx;
        }
    }
    getData() {
        return this.getDataRecursive({});
    }
    setData(data) {
        this.setDataRecursive(data);
    }
    getById(id) {
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
    getDataRecursive(model) {
        this.children.forEach((childDataNode) => {
            const { name, component } = childDataNode;
            if (name && component) {
                if (model[name] == null) {
                    model[name] = component.getData();
                }
            }
            else {
                childDataNode.getDataRecursive(model);
            }
        });
        return model;
    }
    setDataRecursive(data) {
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
exports.DataNode = DataNode;
