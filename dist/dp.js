"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
const BaseComponent_1 = require("./component/BaseComponent");
const listener_1 = require("./event/listener");
var dp;
(function (dp) {
    function compose(component, children) {
        children.forEach(child => component.append(child));
        return component;
    }
    function List(props) {
        return Builder_1.Builder.createList(props);
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
        if (typeof definition === 'function') {
            return compose(definition(properties || {}), children);
        }
        if (definition instanceof BaseComponent_1.BaseComponent) {
            return compose(definition, children);
        }
        return compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent_1.BaseComponent)), children);
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));
