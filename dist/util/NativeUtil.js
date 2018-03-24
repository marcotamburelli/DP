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
        var regEx = /(\w+(-\w+)*)\s*:\s*(\w*(\s|\w)*\w)/g;
        var obj = {};
        for (let result = regEx.exec(style); result !== null; result = regEx.exec(style)) {
            const key = toCamelCase(result[1]);
            const value = result[3];
            obj[key] = value;
        }
        return obj;
    }
    function applyClass(element, classProp) {
        classProp.split(' ').forEach(_class => element.classList.add(_class));
    }
    NativeUtil.applyClass = applyClass;
    function applyStyle(element, style) {
        if (typeof style === 'string') {
            var styleObj = stringToStyleObject(style);
        }
        else {
            styleObj = Object.assign({}, style);
        }
        var elementStyle = element.style;
        Object.keys(styleObj).forEach(key => elementStyle[key] = styleObj[key]);
    }
    NativeUtil.applyStyle = applyStyle;
    function applyProperties(element, properties) {
        /* The 'type' is better to set before others */
        if (properties[const_1.NATIVE_PROPERTIES.TYPE]) {
            element[const_1.NATIVE_PROPERTIES.TYPE] = properties[const_1.NATIVE_PROPERTIES.TYPE];
        }
        Object.keys(properties).forEach(prop => {
            if (prop === const_1.NATIVE_PROPERTIES.TYPE) {
                return;
            }
            const propValue = properties[prop];
            if (prop.startsWith('on') && typeof propValue === 'function') {
                element.addEventListener(prop.substr(2), propValue);
            }
            else {
                element[prop] = propValue;
            }
        });
    }
    NativeUtil.applyProperties = applyProperties;
})(NativeUtil = exports.NativeUtil || (exports.NativeUtil = {}));
