"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./DomWrappers");
/**
 * Basic element.
 * @template E The type of DOM node.
 */
class Container extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, dataNodeProps, observationProperties) {
        super(DomWrappers_1.DomWrappers.simple(element), dataNodeProps, observationProperties);
    }
    setData(data) {
        this.dataNode.setData(data);
    }
    getData() {
        return this.dataNode.getData();
    }
    queryByName(name) {
        return this.dataNode.getByName(name);
    }
    queryById(id) {
        return this.dataNode.getById(id);
    }
}
exports.Container = Container;
