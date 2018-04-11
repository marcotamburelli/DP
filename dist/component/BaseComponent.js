"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObservationNode_1 = require("../event/ObservationNode");
const DataNode_1 = require("./DataNode");
class BaseComponent {
    constructor(domWrapper) {
        this.domWrapper = domWrapper;
        this.children = [];
    }
    static getDataNode(component) {
        return component.dataNode;
    }
    get id() {
        return this.domWrapper.id;
    }
    append(child) {
        if (child instanceof BaseComponent) {
            if (child.parent) {
                throw new Error('Element already appended');
            }
            child.parent = this;
            this.dataNode.append(child.dataNode);
            this.observationNode.append(child.observationNode);
            this.domWrapper.appendChild(child.domWrapper);
        }
        else {
            this.domWrapper.appendChild(`${child}`);
        }
        this.children.push(child);
    }
    remove(child) {
        if (!(child instanceof BaseComponent)) {
            return;
        }
        if (child.parent !== this) {
            throw new Error('Impossible to detach a not child component');
        }
        delete child.parent;
        this.dataNode.remove(child.dataNode);
        this.observationNode.remove(child.observationNode);
        this.domWrapper.removeChild(child.domWrapper);
        const idx = this.children.indexOf(child);
        if (idx >= 0) {
            this.children.splice(idx, 1);
        }
    }
    get domNode() {
        return this.domWrapper.domElement;
    }
    createObservable(observedEvent) {
        return this.observationNode.createObservable(observedEvent);
    }
    cloneComponent(deep = true) {
        const copy = this.prepareCopy();
        deep && this.children.forEach(child => {
            if (child instanceof BaseComponent) {
                copy.append(child.cloneComponent());
            }
            else {
                copy.append(child);
            }
        });
        return copy;
    }
}
exports.BaseComponent = BaseComponent;
class DataDrivenComponentImpl extends BaseComponent {
    constructor(domWrapper, dataNodeProps = {}, observationProperties = {}) {
        super(domWrapper);
        this.dataNode = new DataNode_1.DataNode(dataNodeProps, this);
        this.observationNode = new ObservationNode_1.ObservationNode(domWrapper.domElement, observationProperties, () => this.getData());
    }
}
exports.DataDrivenComponentImpl = DataDrivenComponentImpl;
