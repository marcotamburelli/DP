"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./DomWrappers");
class ListContainer extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(generator, dataNodeProps) {
        super(DomWrappers_1.DomWrappers.array(), dataNodeProps);
        this.generator = generator;
        this.children = [];
    }
    append(child) {
        super.append(child);
        if (child instanceof BaseComponent_1.BaseComponent) {
            this.children.push(child);
        }
    }
    remove(child) {
        super.remove(child);
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
            }
        }
    }
    setData(data) {
        if (!this.generator) {
            return;
        }
        while (this.children.length) {
            super.remove(this.children.pop());
        }
        data.forEach((dataItem, i) => {
            const child = this.generator(dataItem, i);
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
}
exports.ListContainer = ListContainer;
