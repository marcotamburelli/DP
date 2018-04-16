"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomBinder_1 = require("./dom/DomBinder");
const DomWrappers_1 = require("./dom/DomWrappers");
/**
 * Basic element.
 * @template E The type of DOM node.
 */
class Container extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, dataNodeProps, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.simple(element), dataNodeProps, observationProperties);
        this.element = element;
        this.dataNodeProps = dataNodeProps;
        this.bindProperties = bindProperties;
        this.observationProperties = observationProperties;
        this.isContainer = true;
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        this.domBinder.setTo(data, this.domNode);
        this.dataNode.setData(data);
    }
    getData() {
        return Object.assign({}, this.domBinder.getFrom(this.domNode), this.dataNode.getData());
    }
    queryByName(name) {
        return this.dataNode.getByName(name);
    }
    queryById(id) {
        return this.dataNode.getById(id);
    }
    prepareCopy() {
        return new this.constructor(this.element.cloneNode(), this.dataNodeProps, this.bindProperties, this.observationProperties);
    }
}
exports.Container = Container;
