"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObservationNode_1 = require("../event/ObservationNode");
const DataNode_1 = require("./DataNode");
class BaseComponent {
    constructor(domWrapper) {
        this.domWrapper = domWrapper;
    }
    static getDataNode(component) {
        return component.dataNode;
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
        child.domWrapper.detach();
    }
    get domNode() {
        return this.domWrapper.domElement;
    }
    createObservable(observedEvent) {
        return this.observationNode.createObservable(observedEvent);
    }
}
exports.BaseComponent = BaseComponent;
class DataDrivenComponentImpl extends BaseComponent {
    constructor(domWrapper, dataNodeProps = {}, observationProperties = {}) {
        super(domWrapper);
        this.dataNode = new DataNode_1.DataNode(dataNodeProps, (dataNodeProps.name || dataNodeProps.id) && this);
        this.observationNode = new ObservationNode_1.ObservationNode(domWrapper.domElement, observationProperties, () => this.getData());
    }
}
exports.DataDrivenComponentImpl = DataDrivenComponentImpl;
