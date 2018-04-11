"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataNode_1 = require("../component/DataNode");
const DomBinder_1 = require("../component/dom/DomBinder");
const const_1 = require("./const");
class PropertiesReader {
    constructor(properties) {
        this.dataNodeProperties = {};
        this.nativeProperties = {};
        this.observationProperties = {};
        this.bindProperties = {};
        Object.keys(properties).forEach(key => {
            if (!this.checkObservationProperty(key, properties) && !this.checkBindProperties(key, properties)) {
                this.registerDataNodeProperty(key, properties);
                this.registerAsNative(key, properties);
            }
        });
        if (this.dataNodeProperties.name) {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Named;
        }
        else if (Object.keys(this.bindProperties).some(prop => prop !== DomBinder_1.DEFAULT_BIND)) {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Spread;
        }
        else {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Search;
        }
    }
    static create(properties) {
        return new PropertiesReader(properties);
    }
    registerDataNodeProperty(key, properties) {
        switch (key.toLowerCase()) {
            case const_1.DATA_NODE_PROPERTIES.NAME:
                const value = properties[key];
                if (typeof value !== 'string') {
                    throw new Error('Property "name" must be of type string.');
                }
                this.dataNodeProperties[const_1.DATA_NODE_PROPERTIES.NAME] = value;
                break;
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
            if (prop === const_1.DATA_NODE_PROPERTIES.NAME) {
                throw new Error('Property "name" must be of type string.');
            }
            this.bindProperties[prop] = Object.assign({}, propValue);
            return true;
        }
        if (typeof propValue === 'function') {
            if (prop === const_1.DATA_NODE_PROPERTIES.NAME) {
                throw new Error('Property "name" must be of type string.');
            }
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
