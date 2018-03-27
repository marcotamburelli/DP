"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomWrappers;
(function (DomWrappers) {
    function simple(element) {
        return new SimpleDomWrapper(element);
    }
    DomWrappers.simple = simple;
    function input(element) {
        return new InputDomWrapper(element);
    }
    DomWrappers.input = input;
    function array() {
        return new ArrayWrapper();
    }
    DomWrappers.array = array;
    function text(str = '') {
        return new TextWrapper(document.createTextNode(str));
    }
    DomWrappers.text = text;
    class SimpleDomWrapper {
        constructor(domElement) {
            this.domElement = domElement;
        }
        appendChild(child) {
            if (typeof child === 'string') {
                this.domElement.appendChild(document.createTextNode(child));
            }
            else {
                const childDom = child.domElement;
                childDom && this.domElement.appendChild(childDom);
                child.provideParent(this);
            }
        }
        provideParent(parent) {
        }
        detach() {
            const domParent = this.domElement.parentNode;
            domParent && domParent.removeChild(this.domElement);
        }
        registerDomId(namespace, id) {
            this.domElement.id = `${namespace}.${id}`;
        }
        registerDomName(namespace, name) {
        }
    }
    class InputDomWrapper extends SimpleDomWrapper {
        constructor(domElement) {
            super(domElement);
        }
        registerDomName(namespace, name) {
            this.domElement.name = `${namespace}.${name}`;
        }
    }
    const START_PLACEHOLDER = 'START';
    const END_PLACEHOLDER = 'END';
    class ArrayWrapper {
        constructor() {
            this.startPlaceholder = document.createComment(START_PLACEHOLDER);
            this.endPlaceholder = document.createComment(END_PLACEHOLDER);
        }
        appendChild(child) {
            if (!this.domParent) {
                throw new Error('Array requires to be attached to a parent element, in order to add children');
            }
            if (typeof child === 'string') {
                this.domParent.insertBefore(document.createTextNode(child), this.endPlaceholder);
            }
            else {
                const childDom = child.domElement;
                childDom && this.domParent.insertBefore(childDom, this.endPlaceholder);
                child.provideParent(this);
            }
        }
        provideParent(parent) {
            if (parent instanceof ArrayWrapper) {
                this.domParent = parent.domParent;
                this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
                this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
            }
            else {
                this.domParent = parent.domElement;
                this.domParent.appendChild(this.startPlaceholder);
                this.domParent.appendChild(this.endPlaceholder);
            }
        }
        detach() {
            for (let child = this.startPlaceholder.nextSibling; child !== this.endPlaceholder; child = this.startPlaceholder.nextSibling) {
                this.domParent.removeChild(child);
            }
            this.domParent.removeChild(this.startPlaceholder);
            this.domParent.removeChild(this.endPlaceholder);
        }
        registerDomId(namespace, id) {
        }
        registerDomName(namespace, name) {
        }
    }
    class TextWrapper {
        constructor(domElement) {
            this.domElement = domElement;
        }
        appendChild(child) {
        }
        provideParent(parent) {
        }
        detach() {
            const domParent = this.domElement.parentNode;
            domParent && domParent.removeChild(this.domElement);
        }
        registerDomId(namespace, id) {
        }
        registerDomName(namespace, name) {
        }
    }
})(DomWrappers = exports.DomWrappers || (exports.DomWrappers = {}));
