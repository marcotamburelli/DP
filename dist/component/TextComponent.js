"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomBinder_1 = require("./dom/DomBinder");
const DomWrappers_1 = require("./dom/DomWrappers");
class TextComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(dataNodeProps, bindProperties) {
        super(DomWrappers_1.DomWrappers.text(), dataNodeProps);
        this.dataNodeProps = dataNodeProps;
        this.bindProperties = bindProperties;
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        if (!this.dataNode.name) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set) {
            this.domWrapper.domElement.data = set(data);
        }
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        return get && get(this.domWrapper.domElement.data);
    }
    prepareCopy() {
        return new this.constructor(this.dataNodeProps, this.bindProperties);
    }
}
exports.TextComponent = TextComponent;
