"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
const BaseComponent_1 = require("./component/BaseComponent");
const listener_1 = require("./event/listener");
var dp;
(function (dp) {
    function List(props) {
        return Builder_1.Builder.createList(props);
    }
    dp.List = List;
    function Text(props) {
        return Builder_1.Builder.createText(props);
    }
    dp.Text = Text;
    function define(definition, properties, ...children) {
        if (typeof definition === 'function') {
            var component = definition(properties || {});
        }
        else if (definition instanceof BaseComponent_1.BaseComponent) {
            component = definition;
        }
        else {
            component = Builder_1.Builder.createComponent(definition, properties || {}, children.some(child => child instanceof BaseComponent_1.BaseComponent));
        }
        children.forEach(child => component.append(child));
        return component;
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));
