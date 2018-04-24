"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
const BaseComponent_1 = require("./component/BaseComponent");
const DomBinder_1 = require("./component/dom/DomBinder");
const listener_1 = require("./event/listener");
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
    function List(props, children) {
        return Builder_1.Builder.createList(props, children);
    }
    dp.List = List;
    function Group(props) {
        return Builder_1.Builder.createGroup(props);
    }
    dp.Group = Group;
    function Text(props) {
        return Builder_1.Builder.createText(props);
    }
    dp.Text = Text;
    function define(definition, properties, ...children) {
        var component;
        switch (definition) {
            case List:
                component = List(properties || {}, children);
                break;
            case Group:
                component = compose(Group(properties || {}), children);
                break;
            case Text:
                component = compose(Text(properties || {}), children);
                break;
            default:
                if (typeof definition === 'function') {
                    component = compose(Builder_1.Builder.createCustomFromFunction(definition, properties || {}), children);
                }
                else if (definition instanceof BaseComponent_1.DomBasedComponent) {
                    component = compose(definition, children);
                }
                else {
                    component = compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent_1.DomBasedComponent)), children);
                }
                break;
        }
        return component;
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));
