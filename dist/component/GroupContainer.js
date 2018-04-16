"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../util/const");
const BaseComponent_1 = require("./BaseComponent");
const DomWrappers_1 = require("./dom/DomWrappers");
class GroupContainer extends BaseComponent_1.DataDrivenComponentImpl {
    constructor(dataNodeProps, nativeProperties) {
        super(DomWrappers_1.DomWrappers.group(), dataNodeProps);
        this.dataNodeProps = dataNodeProps;
        this.nativeProperties = nativeProperties;
        this.isContainer = true;
    }
    get id() {
        return this.nativeProperties && this.nativeProperties[const_1.NATIVE_PROPERTIES.ID];
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
    prepareCopy() {
        return new this.constructor(this.dataNodeProps);
    }
}
exports.GroupContainer = GroupContainer;
