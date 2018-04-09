"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./component/Container");
const generator_1 = require("./component/generator");
const GroupContainer_1 = require("./component/GroupContainer");
const HtmlComponents_1 = require("./component/HtmlComponents");
const ListContainer_1 = require("./component/ListContainer");
const TextComponent_1 = require("./component/TextComponent");
const const_1 = require("./util/const");
const NativeUtil_1 = require("./util/NativeUtil");
const PropertiesReader_1 = require("./util/PropertiesReader");
var DomFactory;
(function (DomFactory) {
    function createElement(tag, nativeProperties) {
        const element = document.createElement(tag);
        NativeUtil_1.NativeUtil.applyProperties(element, nativeProperties);
        return element;
    }
    DomFactory.createElement = createElement;
})(DomFactory || (DomFactory = {}));
var Builder;
(function (Builder) {
    function createContainer(tag, propReader) {
        return new Container_1.Container(DomFactory.createElement(tag, propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createHtmlComponent(tag, propReader) {
        return new HtmlComponents_1.HtmlElementComponent(DomFactory.createElement(tag, propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createInputComponent(propReader) {
        const { dataNodeProperties, bindProperties, nativeProperties, observationProperties } = propReader;
        const element = DomFactory.createElement('input', nativeProperties);
        switch (nativeProperties[const_1.NATIVE_PROPERTIES.TYPE] || '') {
            case 'checkbox':
                return new HtmlComponents_1.CheckBoxInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
            case 'radio':
                return new HtmlComponents_1.RadioInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
            default:
                return new HtmlComponents_1.TextInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
        }
    }
    function createSelectComponent(propReader) {
        return new HtmlComponents_1.SelectComponent(DomFactory.createElement('select', propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createComponent(tag, properties, hasChildren) {
        const propReader = PropertiesReader_1.PropertiesReader.create(properties);
        switch (tag) {
            case const_1.NODES.DIV:
            case const_1.NODES.UL:
            case const_1.NODES.OL:
            case const_1.NODES.LI:
            case const_1.NODES.FORM:
                return (hasChildren ? createContainer : createHtmlComponent)(tag, propReader);
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
                return createHtmlComponent(tag, propReader);
            case const_1.NODES.INPUT:
            case const_1.NODES.TEXTAREA:
                return createInputComponent(propReader);
            case const_1.NODES.SELECT:
                return createSelectComponent(propReader);
        }
        throw new Error(`'${tag}' not supported`);
    }
    Builder.createComponent = createComponent;
    function createList(properties, children) {
        return new ListContainer_1.ListContainer(generator_1.createGenerator(children), PropertiesReader_1.PropertiesReader.create(properties).dataNodeProperties);
    }
    Builder.createList = createList;
    function createGroup(properties) {
        return new GroupContainer_1.GroupContainer(PropertiesReader_1.PropertiesReader.create(properties).bindProperties);
    }
    Builder.createGroup = createGroup;
    function createText(properties) {
        const { dataNodeProperties, bindProperties } = PropertiesReader_1.PropertiesReader.create(properties);
        return new TextComponent_1.TextComponent(dataNodeProperties, bindProperties);
    }
    Builder.createText = createText;
})(Builder = exports.Builder || (exports.Builder = {}));
