"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomBinder_1 = require("../component/dom/DomBinder");
const const_1 = require("./const");
class PropertiesReader {
    constructor(properties) {
        this.dataNodeProperties = {};
        this.nativeProperties = {};
        this.observationProperties = {};
        this.bindProperties = {};
        Object.keys(properties).forEach(key => {
            if (!this.checkGenerator(key, properties) &&
                !this.checkObservationProperty(key, properties) &&
                !this.checkBindProperties(key, properties)) {
                this.registerDataNodeProperty(key, properties);
                this.registerAsNative(key, properties);
            }
        });
    }
    static create(properties) {
        return new PropertiesReader(properties);
    }
    registerDataNodeProperty(key, properties) {
        switch (key.toLowerCase()) {
            case const_1.DATA_NODE_PROPERTIES.ID:
                this.dataNodeProperties[const_1.DATA_NODE_PROPERTIES.ID] = properties[key];
                break;
            case const_1.DATA_NODE_PROPERTIES.NAME:
                this.dataNodeProperties[const_1.DATA_NODE_PROPERTIES.NAME] = properties[key];
                break;
        }
    }
    checkGenerator(key, properties) {
        switch (key.toLowerCase()) {
            case const_1.SPECIFIC_PROPERTIES.GENERATOR:
                const generator = properties[const_1.SPECIFIC_PROPERTIES.GENERATOR];
                if (typeof generator === 'function') {
                    this.generator = generator;
                }
                return true;
        }
    }
    checkObservationProperty(key, properties) {
        const prop = key.toLowerCase();
        const propValue = properties[key];
        if (prop.startsWith('on') && typeof propValue === 'object') {
            this.observationProperties[prop.substr(2)] = Object.assign({}, propValue);
            return true;
        }
    }
    checkBindProperties(key, properties) {
        const prop = key.toLowerCase();
        const propValue = properties[key];
        switch (prop) {
            case const_1.BIND_PROPERTIES.BIND:
                this.bindProperties[DomBinder_1.DEFAULT_BIND] = Object.assign({}, propValue);
                return true;
        }
        if (typeof propValue === 'object' || propValue.get || propValue.set) {
            this.bindProperties[prop] = Object.assign({}, propValue);
            return true;
        }
        if (typeof propValue === 'function') {
            this.bindProperties[prop] = { set: propValue };
            return true;
        }
    }
    registerAsNative(key, properties) {
        const prop = key.toLowerCase();
        switch (prop) {
            case const_1.NATIVE_PROPERTIES.TYPE:
                this.nativeProperties[const_1.NATIVE_PROPERTIES.TYPE] = properties[key].toLowerCase();
                break;
            default:
                this.nativeProperties[prop] = properties[key];
                break;
        }
    }
}
exports.PropertiesReader = PropertiesReader;
