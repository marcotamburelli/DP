"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObservationNode_1 = require("../event/ObservationNode");
const DataNode_1 = require("./DataNode");
class DomBasedComponent {
    constructor() {
        this.children = [];
    }
    get id() {
        return this.domWrapper.id;
    }
    append(child) {
        if (child instanceof DomBasedComponent) {
            if (child.parent) {
                throw new Error('Element already appended');
            }
            child.parent = this;
            this.observationNode.append(child.observationNode);
            this.domWrapper.appendChild(child.domWrapper);
        }
        else {
            this.domWrapper.appendChild(`${child}`);
        }
        this.children.push(child);
    }
    remove(child) {
        if (!(child instanceof DomBasedComponent)) {
            return;
        }
        if (child.parent !== this) {
            throw new Error('Impossible to detach a not child component');
        }
        delete child.parent;
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
            if (child instanceof DomBasedComponent) {
                copy.append(child.cloneComponent());
            }
            else {
                copy.append(child);
            }
        });
        return copy;
    }
}
exports.DomBasedComponent = DomBasedComponent;
class DataDrivenComponentImpl extends DomBasedComponent {
    constructor(domWrapper, dataNodeProps = {}, observationProperties = {}) {
        super();
        this.domWrapper = domWrapper;
        this.dataNode = new DataNode_1.DataNode(dataNodeProps, this);
        this.observationNode = new ObservationNode_1.ObservationNode(this.dataNode, observationProperties);
    }
    append(child) {
        super.append(child);
        if (child instanceof DataDrivenComponentImpl) {
            this.dataNode.append(child.dataNode);
        }
    }
    remove(child) {
        super.remove(child);
        if (child instanceof DataDrivenComponentImpl) {
            this.dataNode.remove(child.dataNode);
        }
    }
}
exports.DataDrivenComponentImpl = DataDrivenComponentImpl;
