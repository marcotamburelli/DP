"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("../component//BaseComponent");
const CustomComponent_1 = require("./CustomComponent");
exports.createGenerator = (content) => () => {
    return new class extends CustomComponent_1.CustomComponent {
        constructor() {
            super();
        }
        generateComponent() {
            return content.map(child => child instanceof BaseComponent_1.DomBasedComponent ? child.cloneComponent() : child);
        }
    }();
};
