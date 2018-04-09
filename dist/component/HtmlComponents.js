"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DataNode_1 = require("./DataNode");
const DomBinder_1 = require("./dom/DomBinder");
const DomWrappers_1 = require("./dom/DomWrappers");
class HtmlComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(DomWrappers_1.DomWrappers.simple(element), dataNodeProperties, observationProperties);
        this.element = element;
        this.dataNodeProperties = dataNodeProperties;
        this.bindProperties = bindProperties;
        this.observationProperties = observationProperties;
        this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
    }
    prepareCopy() {
        return new this.constructor(this.element.cloneNode(), this.dataNodeProperties, this.bindProperties, this.observationProperties);
    }
}
exports.HtmlComponent = HtmlComponent;
class HtmlElementComponent extends HtmlComponent {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(element, dataNodeProperties, bindProperties, observationProperties);
    }
    setData(data) {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
class TextInputComponent extends HtmlComponent {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(element, dataNodeProperties, bindProperties, observationProperties);
    }
    setData(data) {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set) {
            this.domWrapper.domElement.value = set(data);
        }
    }
    getData() {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        return get && get(this.domWrapper.domElement.value);
    }
}
exports.TextInputComponent = TextInputComponent;
class CheckBoxInputComponent extends HtmlComponent {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(element, dataNodeProperties, bindProperties, observationProperties);
    }
    setData(data) {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
            return;
        }
        const set = this.domBinder.getDefaultBinder().set;
        if (set) {
            this.domWrapper.domElement.checked = set(data);
        }
    }
    getData() {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
            return;
        }
        const get = this.domBinder.getDefaultBinder().get;
        return get && get(this.domWrapper.domElement.checked);
    }
}
exports.CheckBoxInputComponent = CheckBoxInputComponent;
class SelectComponent extends HtmlComponent {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(element, dataNodeProperties, bindProperties, observationProperties);
    }
    setData(data = []) {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
class RadioInputComponent extends HtmlComponent {
    constructor(element, dataNodeProperties = {}, bindProperties, observationProperties) {
        super(element, dataNodeProperties, bindProperties, observationProperties);
    }
    setData(data) {
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
        if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
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
