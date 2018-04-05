"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomBinder_1 = require("./dom/DomBinder");
const DomWrappers_1 = require("./dom/DomWrappers");
class HtmlElementComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.simple(element), properties, observationProperties);
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        if (!this.dataNode.name) {
            return;
        }
        if (this.domBinder.isDefault()) {
            const set = this.domBinder.getDefaultBinder().set;
            set && this.setDefaultValue(set(data));
        }
        else {
            this.domBinder.setTo(data, this.domNode);
        }
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        if (this.domBinder.isDefault()) {
            const get = this.domBinder.getDefaultBinder().get;
            return get && get(this.getDefaultValue());
        }
        else {
            return this.domBinder.getFrom(this.domNode);
        }
    }
    setDefaultValue(value) {
        this.domWrapper.domElement.textContent = value;
    }
    getDefaultValue() {
        return this.domWrapper.domElement.textContent;
    }
}
exports.HtmlElementComponent = HtmlElementComponent;
class TextInputComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        if (!this.dataNode.name) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set) {
            this.domWrapper.domElement.value = set(data);
        }
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        return get && get(this.domWrapper.domElement.value);
    }
}
exports.TextInputComponent = TextInputComponent;
class CheckBoxInputComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        if (!this.dataNode.name) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set) {
            this.domWrapper.domElement.checked = set(data);
        }
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        return get && get(this.domWrapper.domElement.checked);
    }
}
exports.CheckBoxInputComponent = CheckBoxInputComponent;
class SelectComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, properties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data = []) {
        if (!this.dataNode.name) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set == null) {
            return;
        }
        const { options } = this.domWrapper.domElement;
        const values = {};
        if (Array.isArray(data)) {
            for (const t of data) {
                values[set(t)] = true;
            }
        }
        else {
            values[set(data)] = true;
        }
        for (let i = 0; i < options.length; i++) {
            const opt = options.item(i);
            opt.selected = (values[opt.value] === true);
        }
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        if (get == null) {
            return;
        }
        const data = [];
        const { options } = this.domWrapper.domElement;
        for (let i = 0; i < options.length; i++) {
            const opt = options.item(i);
            if (opt.selected) {
                data.push(get(opt.value));
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
    constructor(element, properties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.input(element), properties, observationProperties);
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    setData(data) {
        if (!this.dataNode.name) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set == null) {
            return;
        }
        const radioInput = this.domWrapper.domElement;
        radioInput.checked = (radioInput.value === set(data));
    }
    getData() {
        if (!this.dataNode.name) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        if (get == null) {
            return;
        }
        const radioInput = this.domWrapper.domElement;
        if (radioInput.checked) {
            return get(radioInput.value);
        }
    }
}
exports.RadioInputComponent = RadioInputComponent;
