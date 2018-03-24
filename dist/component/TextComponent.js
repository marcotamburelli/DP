"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./DomWrappers");
class TextComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(dataNodeProps) {
        super(DomWrappers_1.DomWrappers.text(), dataNodeProps);
    }
    setData(data) {
        if (this.dataNode.name) {
            this.domWrapper.domElement.data = data;
        }
    }
    getData() {
        if (this.dataNode.name) {
            return this.domWrapper.domElement.data;
        }
    }
}
exports.TextComponent = TextComponent;
