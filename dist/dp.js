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
        if (definition === List) {
            component = List(properties, children);
        }
        else if (typeof definition === 'function') {
            component = compose(definition(properties || {}), children);
        }
        else if (definition instanceof BaseComponent_1.BaseComponent) {
            component = compose(definition, children);
        }
        else {
            component = compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent_1.BaseComponent)), children);
        }
        return component;
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));
