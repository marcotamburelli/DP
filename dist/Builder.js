"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./component/Container");
const GroupContainer_1 = require("./component/GroupContainer");
const HtmlComponents_1 = require("./component/HtmlComponents");
const ListContainer_1 = require("./component/ListContainer");
const TextComponent_1 = require("./component/TextComponent");
const CustomComponent_1 = require("./generator/CustomComponent");
const generator_1 = require("./generator/generator");
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
            case const_1.INPUT_NODES.INPUT:
            case const_1.INPUT_NODES.TEXTAREA:
                return createInputComponent(propReader);
            case const_1.INPUT_NODES.SELECT:
                return createSelectComponent(propReader);
            default:
                return (hasChildren ? createContainer : createHtmlComponent)(tag, propReader);
        }
    }
    Builder.createComponent = createComponent;
    function createList(properties, children) {
        const { dataNodeProperties, nativeProperties } = PropertiesReader_1.PropertiesReader.create(properties);
        return new ListContainer_1.ListContainer(generator_1.createGenerator(children), dataNodeProperties, nativeProperties);
    }
    Builder.createList = createList;
    function createGroup(properties) {
        const { dataNodeProperties, nativeProperties } = PropertiesReader_1.PropertiesReader.create(properties);
        return new GroupContainer_1.GroupContainer(dataNodeProperties, nativeProperties);
    }
    Builder.createGroup = createGroup;
    function createText(properties) {
        const { dataNodeProperties, bindProperties, nativeProperties } = PropertiesReader_1.PropertiesReader.create(properties);
        return new TextComponent_1.TextComponent(dataNodeProperties, bindProperties, nativeProperties);
    }
    Builder.createText = createText;
    function createCustom(generator, properties) {
        const proto = generator.prototype;
        if (proto && proto instanceof CustomComponent_1.CustomComponent) {
            return new proto.constructor(properties);
        }
        return new class extends CustomComponent_1.CustomComponent {
            constructor() {
                super();
            }
            generateComponent() {
                return generator(properties);
            }
        }();
    }
    Builder.createCustom = createCustom;
})(Builder = exports.Builder || (exports.Builder = {}));
