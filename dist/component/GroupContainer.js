"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./dom/DomWrappers");
class GroupContainer extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(dataNodeProps) {
        super(DomWrappers_1.DomWrappers.group(), dataNodeProps);
    }
    setData(data) {
        this.dataNode.setData(data);
    }
    getData() {
        return this.dataNode.getData();
    }
    queryByName(name) {
        return this.dataNode.getByName(name);
    }
    queryById(id) {
        return this.dataNode.getById(id);
    }
}
exports.GroupContainer = GroupContainer;
