"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomWrappers;
(function (DomWrappers) {
    class AbstractDomWrapper {
        constructor(domElement) {
            this.domElement = domElement;
        }
        provideParent(parent) {
            this.parentDomWrapper = parent;
        }
        removeChild(child) {
            if (child instanceof AbstractDomWrapper) {
                child.detach();
            }
        }
        clone() {
            const domCopy = this.domElement && this.domElement.cloneNode();
            return new this.constructor(domCopy);
        }
    }
    function simple(element) {
        return new SimpleDomWrapper(element);
    }
    DomWrappers.simple = simple;
    function group() {
        return new GroupWrapper();
    }
    DomWrappers.group = group;
    function text(str = '') {
        return new TextWrapper(document.createTextNode(str));
    }
    DomWrappers.text = text;
    class SimpleDomWrapper extends AbstractDomWrapper {
        constructor(domElement) {
            super(domElement);
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
        removeChild(child) {
            this.domElement.removeChild(child.domElement);
            delete child.parentDomWrapper;
        }
        detach() {
            const { parentNode } = this.domElement;
            if (this.parentDomWrapper && parentNode) {
                parentNode.removeChild(this.domElement);
            }
        }
    }
    const START_PLACEHOLDER = 'START';
    const END_PLACEHOLDER = 'END';
    class GroupWrapper extends AbstractDomWrapper {
        constructor() {
            super();
            this.startPlaceholder = document.createComment(START_PLACEHOLDER);
            this.endPlaceholder = document.createComment(END_PLACEHOLDER);
            this.children = new Set();
        }
        appendChild(child) {
            this.children.add(child);
            this.fireAppend(child);
        }
        provideParent(parent) {
            super.provideParent(parent);
            if (!this.domParent) {
                return;
            }
            if (parent instanceof GroupWrapper) {
                this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
                this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
            }
            else {
                this.domParent.appendChild(this.startPlaceholder);
                this.domParent.appendChild(this.endPlaceholder);
            }
            this.children.forEach(child => this.fireAppend(child));
        }
        removeChild(child) {
            this.children.delete(child);
            super.removeChild(child);
        }
        detach() {
            for (let child = this.startPlaceholder.nextSibling; child !== this.endPlaceholder; child = this.startPlaceholder.nextSibling) {
                this.domParent.removeChild(child);
            }
            this.domParent.removeChild(this.startPlaceholder);
            this.domParent.removeChild(this.endPlaceholder);
        }
        fireAppend(child) {
            if (!this.domParent) {
                return;
            }
            if (typeof child === 'string') {
                var childNode = document.createTextNode(child);
            }
            else {
                childNode = child.domElement;
                child.provideParent(this);
            }
            if (!childNode) {
                return;
            }
            if (this.domParent) {
                this.domParent.insertBefore(childNode, this.endPlaceholder);
            }
        }
        get domParent() {
            var parentWrapper = this.parentDomWrapper;
            while (parentWrapper) {
                if (parentWrapper.domElement) {
                    return parentWrapper.domElement;
                }
                else {
                    parentWrapper = parentWrapper.parentDomWrapper;
                }
            }
        }
    }
    class TextWrapper extends AbstractDomWrapper {
        constructor(domElement) {
            super(domElement);
        }
        appendChild(child) {
        }
        detach() {
            const { parentNode } = this.domElement;
            parentNode && parentNode.removeChild(this.domElement);
        }
    }
})(DomWrappers = exports.DomWrappers || (exports.DomWrappers = {}));
