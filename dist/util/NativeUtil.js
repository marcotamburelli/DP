"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
var NativeUtil;
(function (NativeUtil) {
    function toCamelCase(key) {
        return key.replace(/((-?)\w+)/g, (match, index) => {
            if (match.charAt(0) === '-') {
                return `${match.charAt(1).toUpperCase()}${match.substr(2).toLowerCase()}`;
            }
            else {
                return match.toLowerCase();
            }
        });
    }
    function stringToStyleObject(style) {
        const regEx = /(\w+(-\w+)*)\s*:\s*(\w*(\s|\w)*\w)/g;
        const obj = {};
        for (let result = regEx.exec(style); result !== null; result = regEx.exec(style)) {
            const key = toCamelCase(result[1]);
            const value = result[3];
            obj[key] = value;
        }
        return obj;
    }
    function applyClass(element, cssClass) {
        if (typeof cssClass === 'string') {
            var classes = cssClass.split(' ');
        }
        else if (Array.isArray(cssClass)) {
            classes = cssClass;
        }
        else {
            classes = Object.keys(cssClass).filter(className => cssClass[className]);
        }
        classes.forEach(className => element.classList.add(className));
    }
    function applyStyle(element, style) {
        if (typeof style === 'string') {
            var styleObj = stringToStyleObject(style);
        }
        else {
            styleObj = Object.assign({}, style);
        }
        const elementStyle = element.style;
        Object.keys(styleObj).forEach(key => elementStyle[key] = styleObj[key]);
    }
    function extractStyle(element) {
        const { style } = element;
        const styleValue = {};
        const propCount = style.length;
        for (let i = 0; i < propCount; i++) {
            const prop = style[i];
            styleValue[toCamelCase(prop)] = style.getPropertyValue(prop);
        }
        return styleValue;
    }
    function extractClass(element) {
        const { classList } = element;
        const cssClass = [];
        for (const className of classList) {
            cssClass.push(className);
        }
        return cssClass;
    }
    function applyProperty(element, { name, value }) {
        const { classList, style } = element;
        if (classList && name === const_1.STYLE_PROPERTIES.CLASS) {
            return applyClass(element, value);
        }
        if (style && name === const_1.STYLE_PROPERTIES.STYLE) {
            return applyStyle(element, value);
        }
        if (name.startsWith('on') && typeof value === 'function') {
            return element.addEventListener(name.substr(2), value);
        }
        const attr = document.createAttribute(name);
        attr.value = value;
        element.attributes.setNamedItem(attr);
    }
    NativeUtil.applyProperty = applyProperty;
    function extractProperty(element, name) {
        const { classList, style } = element;
        if (classList && name === const_1.STYLE_PROPERTIES.CLASS) {
            return extractClass(element);
        }
        if (style && name === const_1.STYLE_PROPERTIES.STYLE) {
            return extractStyle(element);
        }
        const attr = element.attributes.getNamedItem(name);
        if (attr != null) {
            return attr.value;
        }
    }
    NativeUtil.extractProperty = extractProperty;
    function applyProperties(element, properties) {
        /* The 'type' is better to set before others */
        if (properties[const_1.NATIVE_PROPERTIES.TYPE]) {
            applyProperty(element, { name: const_1.NATIVE_PROPERTIES.TYPE, value: properties[const_1.NATIVE_PROPERTIES.TYPE] });
        }
        Object.keys(properties).forEach(name => {
            if (name === const_1.NATIVE_PROPERTIES.TYPE) {
                return;
            }
            const value = properties[name];
            applyProperty(element, { name, value });
        });
    }
    NativeUtil.applyProperties = applyProperties;
})(NativeUtil = exports.NativeUtil || (exports.NativeUtil = {}));
