"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../util/const");
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./dom/DomWrappers");
class ListContainer extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(generator, dataNodeProps, nativeProperties) {
        super(DomWrappers_1.DomWrappers.group(), dataNodeProps);
        this.generator = generator;
        this.dataNodeProps = dataNodeProps;
        this.nativeProperties = nativeProperties;
        this.isContainer = true;
        this.isList = true;
    }
    get id() {
        return this.nativeProperties && this.nativeProperties[const_1.NATIVE_PROPERTIES.ID];
    }
    append(child) {
        if (!(child instanceof BaseComponent_1.DomBasedComponent)) {
            throw new Error('List can only append component');
        }
        super.append(child);
    }
    setData(data) {
        if (!this.generator) {
            return;
        }
        while (this.children.length) {
            super.remove(this.children.pop());
        }
        data.forEach((dataItem) => {
            const child = this.generator();
            child.setData(dataItem);
            this.append(child);
        });
    }
    getData() {
        return this.children.map(child => child.getData());
    }
    getChildCount() {
        return this.children.length;
    }
    getFirstChild() {
        return this.children[0];
    }
    getLastChild() {
        return this.children[this.children.length - 1];
    }
    queryByIdx(idx) {
        return this.children[idx];
    }
    queryByName(name) {
        return this.dataNode.getByName(name);
    }
    queryById(id) {
        return this.dataNode.getById(id);
    }
    prepareCopy() {
        return new this.constructor(this.generator, this.dataNodeProps);
    }
}
exports.ListContainer = ListContainer;
