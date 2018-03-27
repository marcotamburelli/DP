"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./DomWrappers");
function stringValue(x) {
    if (x == null) {
        return '';
    }
    else {
        return x.toString();
    }
}
class HtmlElementComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, observationProperties, transformer) {
        super(DomWrappers_1.DomWrappers.simple(element), properties, observationProperties);
        this.transformer = transformer;
    }
    setData(data) {
        if (this.dataNode.name) {
            this.domWrapper.domElement.textContent = stringValue(data);
        }
    }
    getData() {
        if (this.dataNode.name && this.transformer) {
            return this.transformer(this.domWrapper.domElement.textContent);
        }
    }
}
exports.HtmlElementComponent = HtmlElementComponent;
class TextInputComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, observationProperties, transformer) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.transformer = transformer;
    }
    setData(data) {
        if (this.dataNode.name) {
            this.domWrapper.domElement.value = stringValue(data);
        }
    }
    getData() {
        if (this.dataNode.name && this.transformer) {
            return this.transformer(this.domWrapper.domElement.value);
        }
    }
}
exports.TextInputComponent = TextInputComponent;
class CheckBoxInputComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, observationProperties) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
    }
    setData(data) {
        if (this.dataNode.name) {
            this.domWrapper.domElement.checked = !!data;
        }
    }
    getData() {
        if (this.dataNode.name) {
            return this.domWrapper.domElement.checked;
        }
    }
}
exports.CheckBoxInputComponent = CheckBoxInputComponent;
class SelectComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, observationProperties, transformer) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.transformer = transformer;
    }
    setData(data = []) {
        if (!this.dataNode.name) {
            return;
        }
        const { options } = this.domWrapper.domElement;
        const values = {};
        if (Array.isArray(data)) {
            for (const t of data) {
                values[t.toString()] = true;
            }
        }
        else {
            values[stringValue(data)] = true;
        }
        for (let i = 0; i < options.length; i++) {
            const opt = options.item(i);
            opt.selected = (values[opt.value] === true);
        }
    }
    getData() {
        if (!this.dataNode.name || !this.transformer) {
            return;
        }
        const data = [];
        const { options } = this.domWrapper.domElement;
        for (let i = 0; i < options.length; i++) {
            const opt = options.item(i);
            if (opt.selected) {
                data.push(this.transformer(opt.value));
            }
        }
        if (this.domWrapper.domElement.multiple) {
            return data;
        }
        else {
            return data[0];
        }
    }
}
exports.SelectComponent = SelectComponent;
class RadioInputComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, observationProperties, transformer) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.transformer = transformer;
    }
    setData(data) {
        if (this.dataNode.name) {
            const radioInput = this.domWrapper.domElement;
            radioInput.checked = (radioInput.value === stringValue(data));
        }
    }
    getData() {
        if (this.dataNode.name && this.transformer) {
            const radioInput = this.domWrapper.domElement;
            if (radioInput.checked) {
                return this.transformer(radioInput.value);
            }
        }
    }
}
exports.RadioInputComponent = RadioInputComponent;
