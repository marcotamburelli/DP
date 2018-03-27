"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
var PropertiesUtil;
(function (PropertiesUtil) {
    function getDataNodeProperties(properties) {
        return {
            id: properties[const_1.DATA_NODE_PROPERTIES.ID],
            name: properties[const_1.DATA_NODE_PROPERTIES.NAME]
        };
    }
    PropertiesUtil.getDataNodeProperties = getDataNodeProperties;
    function getTransformer(properties) {
        const type = properties[const_1.SPECIFIC_PROPERTIES.VALUE_TYPE];
        switch (type) {
            case 'number': return (value) => parseInt(value);
            case 'number.float': return (value) => parseFloat(value);
            default: return (value) => value;
        }
    }
    PropertiesUtil.getTransformer = getTransformer;
    function getGenerator(properties) {
        const generator = properties[const_1.SPECIFIC_PROPERTIES.GENERATOR];
        if (typeof generator === 'function') {
            return generator;
        }
    }
    PropertiesUtil.getGenerator = getGenerator;
    function getStyleProperties(properties) {
        return {
            class: properties[const_1.STYLE_PROPERTIES.CLASS],
            style: properties[const_1.STYLE_PROPERTIES.STYLE]
        };
    }
    PropertiesUtil.getStyleProperties = getStyleProperties;
    function getNativeProperties(properties) {
        const nativeProps = Object.assign({}, properties);
        delete nativeProps[const_1.DATA_NODE_PROPERTIES.ID];
        delete nativeProps[const_1.SPECIFIC_PROPERTIES.VALUE_TYPE];
        delete nativeProps[const_1.SPECIFIC_PROPERTIES.GENERATOR];
        delete nativeProps[const_1.STYLE_PROPERTIES.CLASS];
        delete nativeProps[const_1.STYLE_PROPERTIES.STYLE];
        return nativeProps;
    }
    PropertiesUtil.getNativeProperties = getNativeProperties;
    function getObservationProperties(properties) {
        const observationProperties = {};
        Object.keys(properties).forEach(prop => {
            const propValue = properties[prop];
            if (prop.startsWith('on') && typeof propValue === 'object') {
                observationProperties[prop.substr(2)] = Object.assign({}, propValue);
            }
        });
        return observationProperties;
    }
    PropertiesUtil.getObservationProperties = getObservationProperties;
})(PropertiesUtil = exports.PropertiesUtil || (exports.PropertiesUtil = {}));
