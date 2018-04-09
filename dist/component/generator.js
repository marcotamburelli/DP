"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const GroupContainer_1 = require("./GroupContainer");
exports.createGenerator = (content) => () => {
    if (content.length) {
        const group = new GroupContainer_1.GroupContainer();
        content.forEach(child => {
            if (child instanceof BaseComponent_1.BaseComponent) {
                group.append(child.cloneComponent());
            }
            else {
                group.append(child);
            }
        });
        return group;
    }
    const component = content[0];
    if (component instanceof BaseComponent_1.BaseComponent) {
        return component.cloneComponent();
    }
};
