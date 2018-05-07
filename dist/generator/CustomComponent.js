"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomWrappers_1 = require("../component//dom/DomWrappers");
const BaseComponent_1 = require("../component/BaseComponent");
const const_1 = require("../util/const");
const PropertiesReader_1 = require("../util/PropertiesReader");
class CustomComponent extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(properties = {}) {
        super(DomWrappers_1.DomWrappers.group(), PropertiesReader_1.PropertiesReader.create(properties).dataNodeProperties);
        this.properties = properties;
        this.isContainer = true;
        const generated = this.generateComponent(properties);
        if (Array.isArray(generated)) {
            generated.forEach(component => this.appendImproper(component));
        }
        else {
            this.appendImproper(generated);
        }
    }
    get id() {
        return this.properties[const_1.NATIVE_PROPERTIES.ID];
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
    prepareCopy() {
        return new this.constructor(this.properties);
    }
    appendImproper(child) {
        this.improperChildren.add(child);
        this.append(child);
    }
}
exports.CustomComponent = CustomComponent;
