"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./component/Container");
const HtmlComponents_1 = require("./component/HtmlComponents");
const ListContainer_1 = require("./component/ListContainer");
const TextComponent_1 = require("./component/TextComponent");
const const_1 = require("./util/const");
const NativeUtil_1 = require("./util/NativeUtil");
const PropertiesUtil_1 = require("./util/PropertiesUtil");
var DomFactory;
(function (DomFactory) {
    function createElement(tag, properties) {
        const element = document.createElement(tag);
        const styleProps = PropertiesUtil_1.PropertiesUtil.getStyleProperties(properties);
        const nativeProps = PropertiesUtil_1.PropertiesUtil.getNativeProperties(properties);
        styleProps.class && NativeUtil_1.NativeUtil.applyClass(element, styleProps.class);
        styleProps.style && NativeUtil_1.NativeUtil.applyStyle(element, styleProps.style);
        NativeUtil_1.NativeUtil.applyProperties(element, nativeProps);
        return element;
    }
    DomFactory.createElement = createElement;
})(DomFactory || (DomFactory = {}));
var Builder;
(function (Builder) {
    function createContainer(tag, properties) {
        return new Container_1.Container(DomFactory.createElement(tag, properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties));
    }
    function createHtmlComponent(tag, properties) {
        return new HtmlComponents_1.HtmlElementComponent(DomFactory.createElement(tag, properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties), PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
    }
    function createInputComponent(properties) {
        const element = DomFactory.createElement('input', properties);
        const dataNodeProperties = PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties);
        const observationProperties = PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties);
        switch ((properties[const_1.NATIVE_PROPERTIES.TYPE] || '').toLowerCase()) {
            case 'checkbox':
                return new HtmlComponents_1.CheckBoxInputComponent(element, dataNodeProperties, observationProperties);
            case 'radio':
                return new HtmlComponents_1.RadioInputComponent(element, dataNodeProperties, observationProperties, PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
            default:
                return new HtmlComponents_1.TextInputComponent(element, dataNodeProperties, observationProperties, PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
        }
    }
    function createSelectComponent(properties) {
        return new HtmlComponents_1.SelectComponent(DomFactory.createElement('select', properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties), PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
    }
    function normalizeProperties(properties) {
        const normalizedProperties = {};
        Object.keys(properties).forEach(key => {
            normalizedProperties[key.toLowerCase()] = properties[key];
        });
        return normalizedProperties;
    }
    function createComponent(tag, properties, hasChildren) {
        const normalizedProperties = normalizeProperties(properties);
        switch (tag) {
            case const_1.NODES.DIV:
            case const_1.NODES.UL:
            case const_1.NODES.OL:
            case const_1.NODES.LI:
            case const_1.NODES.FORM:
                return (hasChildren ? createContainer : createHtmlComponent)(tag, normalizedProperties);
            case const_1.NODES.LABEL:
            case const_1.NODES.OPTION:
            case const_1.NODES.SPAN:
            case const_1.NODES.BUTTON:
            case const_1.NODES.A:
            case const_1.NODES.P:
            case const_1.NODES.H1:
            case const_1.NODES.H2:
            case const_1.NODES.H3:
            case const_1.NODES.H4:
            case const_1.NODES.H5:
            case const_1.NODES.H6:
            case const_1.NODES.BR:
                return createHtmlComponent(tag, normalizedProperties);
            case const_1.NODES.INPUT:
            case const_1.NODES.TEXTAREA:
                return createInputComponent(normalizedProperties);
            case const_1.NODES.SELECT:
                return createSelectComponent(normalizedProperties);
        }
        throw new Error(`'${tag}' not supported`);
    }
    Builder.createComponent = createComponent;
    function createList(properties) {
        return new ListContainer_1.ListContainer(PropertiesUtil_1.PropertiesUtil.getGenerator(properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties));
    }
    Builder.createList = createList;
    function createText(properties) {
        return new TextComponent_1.TextComponent(PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties));
    }
    Builder.createText = createText;
})(Builder = exports.Builder || (exports.Builder = {}));
