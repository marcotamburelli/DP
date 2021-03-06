"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NativeUtil_1 = require("../../util/NativeUtil");
exports.DEFAULT_BIND = '____DEFAULT';
class DomBinder {
    constructor(properties) {
        this.properties = properties;
        this.names = Object.keys(properties).filter(name => name !== exports.DEFAULT_BIND);
    }
    static create(properties = {}) {
        if (properties[exports.DEFAULT_BIND]) {
            return new DomBinder(Object.assign({}, properties));
        }
        else {
            return new DomBinder(Object.assign({}, properties, { [exports.DEFAULT_BIND]: DomBinder.IDENTITY_BINDER }));
        }
    }
    isDefault() {
        return this.names.length === 0 && this.getDefaultBinder() != null;
    }
    getDefaultBinder() {
        return this.properties[exports.DEFAULT_BIND];
    }
    setTo(data, node) {
        switch (node.nodeType) {
            case node.ELEMENT_NODE:
                this.names
                    .filter(name => this.properties[name].set != null)
                    .forEach(name => {
                    NativeUtil_1.NativeUtil.applyProperty(node, { name, value: this.properties[name].set(data[name]) });
                });
                break;
        }
    }
    getFrom(node) {
        switch (node.nodeType) {
            case node.ELEMENT_NODE:
                return this.names
                    .filter(name => this.properties[name].get != null)
                    .reduce((data, name) => (Object.assign({}, data, { [name]: this.properties[name].get(NativeUtil_1.NativeUtil.extractProperty(node, name)) })), {});
            default:
                return null;
        }
    }
}
DomBinder.IDENTITY_BINDER = {
    get(v) { return v; },
    set(v) { return v; }
};
DomBinder.INT_BINDER = {
    set: (n) => n == null ? '' : `${n}`,
    get: (v) => parseInt(v)
};
exports.DomBinder = DomBinder;
