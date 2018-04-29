"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
const BaseComponent_1 = require("./component/BaseComponent");
const DomBinder_1 = require("./component/dom/DomBinder");
const listener_1 = require("./event/listener");
class ComponentDefinition {
}
exports.ComponentDefinition = ComponentDefinition;
var dp;
(function (dp) {
    function compose(component, children) {
        children.forEach(child => component.append(child));
        return component;
    }
    dp.IDENTITY_BINDER = DomBinder_1.DomBinder.IDENTITY_BINDER;
    dp.INT_BINDER = DomBinder_1.DomBinder.INT_BINDER;
    dp.DATA_EVENT = 'DATA_EVENT';
    dp.DATA_EMITTER = (eventType = dp.DATA_EVENT) => ({ eventType });
    class List extends ComponentDefinition {
    }
    dp.List = List;
    class Group extends ComponentDefinition {
    }
    dp.Group = Group;
    class Text extends ComponentDefinition {
    }
    dp.Text = Text;
    function define(definition, properties, ...children) {
        var component;
        if (typeof definition === 'function') {
            component = createComponentFromFunction(definition, properties, children);
        }
        else if (definition instanceof BaseComponent_1.DomBasedComponent) {
            component = compose(definition, children);
        }
        else {
            component = compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent_1.DomBasedComponent)), children);
        }
        return component;
    }
    dp.define = define;
    function createComponentFromFunction(definition, properties, children) {
        switch (definition) {
            case List:
                return Builder_1.Builder.createList(properties || {}, children);
            case Group:
                return compose(Builder_1.Builder.createGroup(properties || {}), children);
            case Text:
                return compose(Builder_1.Builder.createText(properties || {}), children);
            default:
                return compose(Builder_1.Builder.createCustom(definition, properties || {}), children);
        }
    }
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));
