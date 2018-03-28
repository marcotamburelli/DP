(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dp = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = require("./component/Container");
var HtmlComponents_1 = require("./component/HtmlComponents");
var ListContainer_1 = require("./component/ListContainer");
var TextComponent_1 = require("./component/TextComponent");
var const_1 = require("./util/const");
var NativeUtil_1 = require("./util/NativeUtil");
var PropertiesUtil_1 = require("./util/PropertiesUtil");
var DomFactory;
(function (DomFactory) {
    function createElement(tag, properties) {
        var element = document.createElement(tag);
        var styleProps = PropertiesUtil_1.PropertiesUtil.getStyleProperties(properties);
        var nativeProps = PropertiesUtil_1.PropertiesUtil.getNativeProperties(properties);
        styleProps.class && NativeUtil_1.NativeUtil.applyClass(element, styleProps.class);
        styleProps.style && NativeUtil_1.NativeUtil.applyStyle(element, styleProps.style);
        NativeUtil_1.NativeUtil.applyProperties(element, nativeProps);
        return element;
    }
    DomFactory.createElement = createElement;
})(DomFactory || (DomFactory = {}));
var Builder;
(function (Builder) {
    function createContainer(tag, properties) {
        return new Container_1.Container(DomFactory.createElement(tag, properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties));
    }
    function createHtmlComponent(tag, properties) {
        return new HtmlComponents_1.HtmlElementComponent(DomFactory.createElement(tag, properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties), PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
    }
    function createInputComponent(properties) {
        var element = DomFactory.createElement('input', properties);
        var dataNodeProperties = PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties);
        var observationProperties = PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties);
        switch ((properties[const_1.NATIVE_PROPERTIES.TYPE] || '').toLowerCase()) {
            case 'checkbox':
                return new HtmlComponents_1.CheckBoxInputComponent(element, dataNodeProperties, observationProperties);
            case 'radio':
                return new HtmlComponents_1.RadioInputComponent(element, dataNodeProperties, observationProperties, PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
            default:
                return new HtmlComponents_1.TextInputComponent(element, dataNodeProperties, observationProperties, PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
        }
    }
    function createSelectComponent(properties) {
        return new HtmlComponents_1.SelectComponent(DomFactory.createElement('select', properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties), PropertiesUtil_1.PropertiesUtil.getObservationProperties(properties), PropertiesUtil_1.PropertiesUtil.getTransformer(properties));
    }
    function normalizeProperties(properties) {
        var normalizedProperties = {};
        Object.keys(properties).forEach(function (key) {
            normalizedProperties[key.toLowerCase()] = properties[key];
        });
        return normalizedProperties;
    }
    function createComponent(tag, properties, hasChildren) {
        var normalizedProperties = normalizeProperties(properties);
        switch (tag) {
            case const_1.NODES.DIV:
            case const_1.NODES.UL:
            case const_1.NODES.OL:
            case const_1.NODES.LI:
            case const_1.NODES.FORM:
                return (hasChildren ? createContainer : createHtmlComponent)(tag, normalizedProperties);
            case const_1.NODES.LABEL:
            case const_1.NODES.OPTION:
            case const_1.NODES.SPAN:
            case const_1.NODES.BUTTON:
            case const_1.NODES.A:
            case const_1.NODES.P:
            case const_1.NODES.H1:
            case const_1.NODES.H2:
            case const_1.NODES.H3:
            case const_1.NODES.H4:
            case const_1.NODES.H5:
            case const_1.NODES.H6:
            case const_1.NODES.BR:
                return createHtmlComponent(tag, normalizedProperties);
            case const_1.NODES.INPUT:
            case const_1.NODES.TEXTAREA:
                return createInputComponent(normalizedProperties);
            case const_1.NODES.SELECT:
                return createSelectComponent(normalizedProperties);
        }
        throw new Error("'" + tag + "' not supported");
    }
    Builder.createComponent = createComponent;
    function createList(properties) {
        return new ListContainer_1.ListContainer(PropertiesUtil_1.PropertiesUtil.getGenerator(properties), PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties));
    }
    Builder.createList = createList;
    function createText(properties) {
        return new TextComponent_1.TextComponent(PropertiesUtil_1.PropertiesUtil.getDataNodeProperties(properties));
    }
    Builder.createText = createText;
})(Builder = exports.Builder || (exports.Builder = {}));

},{"./component/Container":5,"./component/HtmlComponents":8,"./component/ListContainer":9,"./component/TextComponent":10,"./util/NativeUtil":14,"./util/PropertiesUtil":15,"./util/const":16}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var ObservationNode_1 = require("../event/ObservationNode");
var DataNode_1 = require("./DataNode");

var BaseComponent = function () {
    function BaseComponent(domWrapper) {
        _classCallCheck(this, BaseComponent);

        this.domWrapper = domWrapper;
    }

    _createClass(BaseComponent, [{
        key: "append",
        value: function append(child) {
            if (child instanceof BaseComponent) {
                if (child.parent) {
                    throw new Error('Element already appended');
                }
                child.parent = this;
                this.dataNode.append(child.dataNode);
                this.observationNode.append(child.observationNode);
                this.domWrapper.appendChild(child.domWrapper);
            } else {
                this.domWrapper.appendChild("" + child);
            }
        }
    }, {
        key: "remove",
        value: function remove(child) {
            if (!(child instanceof BaseComponent)) {
                return;
            }
            if (child.parent !== this) {
                throw new Error('Impossible to detach a not child component');
            }
            delete child.parent;
            this.dataNode.remove(child.dataNode);
            this.observationNode.remove(child.observationNode);
            child.domWrapper.detach();
        }
    }, {
        key: "createObservable",
        value: function createObservable(observedEvent) {
            return this.observationNode.createObservable(observedEvent);
        }
    }, {
        key: "domNode",
        get: function get() {
            return this.domWrapper.domElement;
        }
    }], [{
        key: "getDataNode",
        value: function getDataNode(component) {
            return component.dataNode;
        }
    }]);

    return BaseComponent;
}();

exports.BaseComponent = BaseComponent;

var DataDrivenComponentImpl = function (_BaseComponent) {
    _inherits(DataDrivenComponentImpl, _BaseComponent);

    function DataDrivenComponentImpl(domWrapper) {
        var dataNodeProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, DataDrivenComponentImpl);

        var _this = _possibleConstructorReturn(this, (DataDrivenComponentImpl.__proto__ || Object.getPrototypeOf(DataDrivenComponentImpl)).call(this, domWrapper));

        _this.dataNode = new DataNode_1.DataNode(dataNodeProps, (dataNodeProps.name || dataNodeProps.id) && _this);
        _this.observationNode = new ObservationNode_1.ObservationNode(domWrapper.domElement, observationProperties, function () {
            return _this.getData();
        });
        return _this;
    }

    return DataDrivenComponentImpl;
}(BaseComponent);

exports.DataDrivenComponentImpl = DataDrivenComponentImpl;

},{"../event/ObservationNode":12,"./DataNode":6}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./DomWrappers");
/**
 * Basic element.
 * @template E The type of DOM node.
 */

var Container = function (_BaseComponent_1$Data) {
    _inherits(Container, _BaseComponent_1$Data);

    function Container(element, dataNodeProps, observationProperties) {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, DomWrappers_1.DomWrappers.simple(element), dataNodeProps, observationProperties));
    }

    _createClass(Container, [{
        key: "setData",
        value: function setData(data) {
            this.dataNode.setData(data);
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.dataNode.getData();
        }
    }, {
        key: "queryByName",
        value: function queryByName(name) {
            return this.dataNode.getByName(name);
        }
    }, {
        key: "queryById",
        value: function queryById(id) {
            return this.dataNode.getById(id);
        }
    }]);

    return Container;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.Container = Container;

},{"./BaseComponent":4,"./DomWrappers":7}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var DataNode = function () {
    function DataNode() {
        var dataNodeProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var component = arguments[1];

        _classCallCheck(this, DataNode);

        this.dataNodeProperties = dataNodeProperties;
        this.component = component;
        this.childSeq = 0;
        this.children = new Map();
    }

    _createClass(DataNode, [{
        key: "append",
        value: function append(dataNode) {
            if (dataNode.idx != null) {
                throw new Error('Data node cannot be appended since it already has a parent.');
            }
            dataNode.idx = ++this.childSeq;
            this.children.set(dataNode.idx, dataNode);
        }
    }, {
        key: "remove",
        value: function remove(dataNode) {
            if (dataNode.idx != null) {
                this.children.delete(dataNode.idx);
                delete dataNode.idx;
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.getDataRecursive({});
        }
    }, {
        key: "setData",
        value: function setData(data) {
            this.setDataRecursive(data);
        }
    }, {
        key: "getById",
        value: function getById(id) {
            if (this.id === id) {
                return this.component;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.children.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dataNode = _step.value;

                    var component = dataNode.getById(id);
                    if (component) {
                        return component;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "getByName",
        value: function getByName(name) {
            if (this.name === name) {
                return [this.component];
            }
            var components = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.children.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var dataNode = _step2.value;

                    var componentsByName = dataNode.getByName(name);
                    if (componentsByName) {
                        components = components.concat(componentsByName);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return components;
        }
    }, {
        key: "getDataRecursive",
        value: function getDataRecursive(model) {
            this.children.forEach(function (childDataNode) {
                var name = childDataNode.name,
                    component = childDataNode.component;

                if (name && component) {
                    if (model[name] == null) {
                        model[name] = component.getData();
                    }
                } else {
                    childDataNode.getDataRecursive(model);
                }
            });
            return model;
        }
    }, {
        key: "setDataRecursive",
        value: function setDataRecursive(data) {
            this.children.forEach(function (childDataNode) {
                var name = childDataNode.name,
                    component = childDataNode.component;

                if (!name) {
                    return childDataNode.setDataRecursive(data);
                }
                if (!component) {
                    return childDataNode.setDataRecursive(data[name]);
                }
                component.setData(data[name]);
            });
        }
    }, {
        key: "name",
        get: function get() {
            return this.dataNodeProperties.name;
        }
    }, {
        key: "id",
        get: function get() {
            return this.dataNodeProperties.id;
        }
    }]);

    return DataNode;
}();

exports.DataNode = DataNode;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    function text() {
        var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        return new TextWrapper(document.createTextNode(str));
    }
    DomWrappers.text = text;

    var SimpleDomWrapper = function () {
        function SimpleDomWrapper(domElement) {
            _classCallCheck(this, SimpleDomWrapper);

            this.domElement = domElement;
        }

        _createClass(SimpleDomWrapper, [{
            key: "appendChild",
            value: function appendChild(child) {
                if (typeof child === 'string') {
                    this.domElement.appendChild(document.createTextNode(child));
                } else {
                    var childDom = child.domElement;
                    childDom && this.domElement.appendChild(childDom);
                    child.provideParent(this);
                }
            }
        }, {
            key: "provideParent",
            value: function provideParent(parent) {}
        }, {
            key: "detach",
            value: function detach() {
                var domParent = this.domElement.parentNode;
                domParent && domParent.removeChild(this.domElement);
            }
        }, {
            key: "registerDomId",
            value: function registerDomId(namespace, id) {
                this.domElement.id = namespace + "." + id;
            }
        }, {
            key: "registerDomName",
            value: function registerDomName(namespace, name) {}
        }]);

        return SimpleDomWrapper;
    }();

    var InputDomWrapper = function (_SimpleDomWrapper) {
        _inherits(InputDomWrapper, _SimpleDomWrapper);

        function InputDomWrapper(domElement) {
            _classCallCheck(this, InputDomWrapper);

            return _possibleConstructorReturn(this, (InputDomWrapper.__proto__ || Object.getPrototypeOf(InputDomWrapper)).call(this, domElement));
        }

        _createClass(InputDomWrapper, [{
            key: "registerDomName",
            value: function registerDomName(namespace, name) {
                this.domElement.name = namespace + "." + name;
            }
        }]);

        return InputDomWrapper;
    }(SimpleDomWrapper);

    var START_PLACEHOLDER = 'START';
    var END_PLACEHOLDER = 'END';

    var ArrayWrapper = function () {
        function ArrayWrapper() {
            _classCallCheck(this, ArrayWrapper);

            this.startPlaceholder = document.createComment(START_PLACEHOLDER);
            this.endPlaceholder = document.createComment(END_PLACEHOLDER);
        }

        _createClass(ArrayWrapper, [{
            key: "appendChild",
            value: function appendChild(child) {
                if (!this.domParent) {
                    throw new Error('Array requires to be attached to a parent element, in order to add children');
                }
                if (typeof child === 'string') {
                    this.domParent.insertBefore(document.createTextNode(child), this.endPlaceholder);
                } else {
                    var childDom = child.domElement;
                    childDom && this.domParent.insertBefore(childDom, this.endPlaceholder);
                    child.provideParent(this);
                }
            }
        }, {
            key: "provideParent",
            value: function provideParent(parent) {
                if (parent instanceof ArrayWrapper) {
                    this.domParent = parent.domParent;
                    this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
                    this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
                } else {
                    this.domParent = parent.domElement;
                    this.domParent.appendChild(this.startPlaceholder);
                    this.domParent.appendChild(this.endPlaceholder);
                }
            }
        }, {
            key: "detach",
            value: function detach() {
                for (var child = this.startPlaceholder.nextSibling; child !== this.endPlaceholder; child = this.startPlaceholder.nextSibling) {
                    this.domParent.removeChild(child);
                }
                this.domParent.removeChild(this.startPlaceholder);
                this.domParent.removeChild(this.endPlaceholder);
            }
        }, {
            key: "registerDomId",
            value: function registerDomId(namespace, id) {}
        }, {
            key: "registerDomName",
            value: function registerDomName(namespace, name) {}
        }]);

        return ArrayWrapper;
    }();

    var TextWrapper = function () {
        function TextWrapper(domElement) {
            _classCallCheck(this, TextWrapper);

            this.domElement = domElement;
        }

        _createClass(TextWrapper, [{
            key: "appendChild",
            value: function appendChild(child) {}
        }, {
            key: "provideParent",
            value: function provideParent(parent) {}
        }, {
            key: "detach",
            value: function detach() {
                var domParent = this.domElement.parentNode;
                domParent && domParent.removeChild(this.domElement);
            }
        }, {
            key: "registerDomId",
            value: function registerDomId(namespace, id) {}
        }, {
            key: "registerDomName",
            value: function registerDomName(namespace, name) {}
        }]);

        return TextWrapper;
    }();
})(DomWrappers = exports.DomWrappers || (exports.DomWrappers = {}));

},{}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./DomWrappers");
function stringValue(x) {
    if (x == null) {
        return '';
    } else {
        return x.toString();
    }
}

var HtmlElementComponent = function (_BaseComponent_1$Data) {
    _inherits(HtmlElementComponent, _BaseComponent_1$Data);

    function HtmlElementComponent(element) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments[2];
        var transformer = arguments[3];

        _classCallCheck(this, HtmlElementComponent);

        var _this = _possibleConstructorReturn(this, (HtmlElementComponent.__proto__ || Object.getPrototypeOf(HtmlElementComponent)).call(this, DomWrappers_1.DomWrappers.simple(element), properties, observationProperties));

        _this.transformer = transformer;
        return _this;
    }

    _createClass(HtmlElementComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.name) {
                this.domWrapper.domElement.textContent = stringValue(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.name && this.transformer) {
                return this.transformer(this.domWrapper.domElement.textContent);
            }
        }
    }]);

    return HtmlElementComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.HtmlElementComponent = HtmlElementComponent;

var TextInputComponent = function (_BaseComponent_1$Data2) {
    _inherits(TextInputComponent, _BaseComponent_1$Data2);

    function TextInputComponent(element) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments[2];
        var transformer = arguments[3];

        _classCallCheck(this, TextInputComponent);

        var _this2 = _possibleConstructorReturn(this, (TextInputComponent.__proto__ || Object.getPrototypeOf(TextInputComponent)).call(this, DomWrappers_1.DomWrappers.input(element), properties, observationProperties));

        _this2.transformer = transformer;
        return _this2;
    }

    _createClass(TextInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.name) {
                this.domWrapper.domElement.value = stringValue(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.name && this.transformer) {
                return this.transformer(this.domWrapper.domElement.value);
            }
        }
    }]);

    return TextInputComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.TextInputComponent = TextInputComponent;

var CheckBoxInputComponent = function (_BaseComponent_1$Data3) {
    _inherits(CheckBoxInputComponent, _BaseComponent_1$Data3);

    function CheckBoxInputComponent(element) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments[2];

        _classCallCheck(this, CheckBoxInputComponent);

        return _possibleConstructorReturn(this, (CheckBoxInputComponent.__proto__ || Object.getPrototypeOf(CheckBoxInputComponent)).call(this, DomWrappers_1.DomWrappers.input(element), properties, observationProperties));
    }

    _createClass(CheckBoxInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.name) {
                this.domWrapper.domElement.checked = !!data;
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.name) {
                return this.domWrapper.domElement.checked;
            }
        }
    }]);

    return CheckBoxInputComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.CheckBoxInputComponent = CheckBoxInputComponent;

var SelectComponent = function (_BaseComponent_1$Data4) {
    _inherits(SelectComponent, _BaseComponent_1$Data4);

    function SelectComponent(element) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments[2];
        var transformer = arguments[3];

        _classCallCheck(this, SelectComponent);

        var _this4 = _possibleConstructorReturn(this, (SelectComponent.__proto__ || Object.getPrototypeOf(SelectComponent)).call(this, DomWrappers_1.DomWrappers.input(element), properties, observationProperties));

        _this4.transformer = transformer;
        return _this4;
    }

    _createClass(SelectComponent, [{
        key: "setData",
        value: function setData() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!this.dataNode.name) {
                return;
            }
            var options = this.domWrapper.domElement.options;

            var values = {};
            if (Array.isArray(data)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var t = _step.value;

                        values[t.toString()] = true;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                values[stringValue(data)] = true;
            }
            for (var i = 0; i < options.length; i++) {
                var opt = options.item(i);
                opt.selected = values[opt.value] === true;
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (!this.dataNode.name || !this.transformer) {
                return;
            }
            var data = [];
            var options = this.domWrapper.domElement.options;

            for (var i = 0; i < options.length; i++) {
                var opt = options.item(i);
                if (opt.selected) {
                    data.push(this.transformer(opt.value));
                }
            }
            if (this.domWrapper.domElement.multiple) {
                return data;
            } else {
                return data[0];
            }
        }
    }]);

    return SelectComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.SelectComponent = SelectComponent;

var RadioInputComponent = function (_BaseComponent_1$Data5) {
    _inherits(RadioInputComponent, _BaseComponent_1$Data5);

    function RadioInputComponent(element) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var observationProperties = arguments[2];
        var transformer = arguments[3];

        _classCallCheck(this, RadioInputComponent);

        var _this5 = _possibleConstructorReturn(this, (RadioInputComponent.__proto__ || Object.getPrototypeOf(RadioInputComponent)).call(this, DomWrappers_1.DomWrappers.input(element), properties, observationProperties));

        _this5.transformer = transformer;
        return _this5;
    }

    _createClass(RadioInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.name) {
                var radioInput = this.domWrapper.domElement;
                radioInput.checked = radioInput.value === stringValue(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.name && this.transformer) {
                var radioInput = this.domWrapper.domElement;
                if (radioInput.checked) {
                    return this.transformer(radioInput.value);
                }
            }
        }
    }]);

    return RadioInputComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.RadioInputComponent = RadioInputComponent;

},{"./BaseComponent":4,"./DomWrappers":7}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./DomWrappers");

var ListContainer = function (_BaseComponent_1$Data) {
    _inherits(ListContainer, _BaseComponent_1$Data);

    function ListContainer(generator, dataNodeProps) {
        _classCallCheck(this, ListContainer);

        var _this = _possibleConstructorReturn(this, (ListContainer.__proto__ || Object.getPrototypeOf(ListContainer)).call(this, DomWrappers_1.DomWrappers.array(), dataNodeProps));

        _this.generator = generator;
        _this.children = [];
        return _this;
    }

    _createClass(ListContainer, [{
        key: "append",
        value: function append(child) {
            _get(ListContainer.prototype.__proto__ || Object.getPrototypeOf(ListContainer.prototype), "append", this).call(this, child);
            if (child instanceof BaseComponent_1.BaseComponent) {
                this.children.push(child);
            }
        }
    }, {
        key: "remove",
        value: function remove(child) {
            _get(ListContainer.prototype.__proto__ || Object.getPrototypeOf(ListContainer.prototype), "remove", this).call(this, child);
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i] === child) {
                    this.children.splice(i, 1);
                }
            }
        }
    }, {
        key: "setData",
        value: function setData(data) {
            var _this2 = this;

            if (!this.generator) {
                return;
            }
            while (this.children.length) {
                _get(ListContainer.prototype.__proto__ || Object.getPrototypeOf(ListContainer.prototype), "remove", this).call(this, this.children.pop());
            }
            data.forEach(function (dataItem, i) {
                var child = _this2.generator(dataItem, i);
                child.setData(dataItem);
                _this2.append(child);
            });
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.children.map(function (child) {
                return child.getData();
            });
        }
    }, {
        key: "getChildCount",
        value: function getChildCount() {
            return this.children.length;
        }
    }, {
        key: "getFirstChild",
        value: function getFirstChild() {
            return this.children[0];
        }
    }, {
        key: "getLastChild",
        value: function getLastChild() {
            return this.children[this.children.length - 1];
        }
    }, {
        key: "queryByIdx",
        value: function queryByIdx(idx) {
            return this.children[idx];
        }
    }, {
        key: "queryByName",
        value: function queryByName(name) {
            return this.dataNode.getByName(name);
        }
    }, {
        key: "queryById",
        value: function queryById(id) {
            return this.dataNode.getById(id);
        }
    }]);

    return ListContainer;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.ListContainer = ListContainer;

},{"./BaseComponent":4,"./DomWrappers":7}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./DomWrappers");

var TextComponent = function (_BaseComponent_1$Data) {
    _inherits(TextComponent, _BaseComponent_1$Data);

    function TextComponent(dataNodeProps) {
        _classCallCheck(this, TextComponent);

        return _possibleConstructorReturn(this, (TextComponent.__proto__ || Object.getPrototypeOf(TextComponent)).call(this, DomWrappers_1.DomWrappers.text(), dataNodeProps));
    }

    _createClass(TextComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.name) {
                this.domWrapper.domElement.data = data;
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.name) {
                return this.domWrapper.domElement.data;
            }
        }
    }]);

    return TextComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.TextComponent = TextComponent;

},{"./BaseComponent":4,"./DomWrappers":7}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Builder_1 = require("./Builder");
var BaseComponent_1 = require("./component/BaseComponent");
var listener_1 = require("./event/listener");
var dp;
(function (dp) {
    function compose(component, children) {
        children.forEach(function (child) {
            return component.append(child);
        });
        return component;
    }
    function List(props) {
        return Builder_1.Builder.createList(props);
    }
    dp.List = List;
    function Text(props) {
        return Builder_1.Builder.createText(props);
    }
    dp.Text = Text;
    function define(definition, properties) {
        for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            children[_key - 2] = arguments[_key];
        }

        if (typeof definition === 'function') {
            return compose(definition(properties || {}), children);
        }
        if (definition instanceof BaseComponent_1.BaseComponent) {
            return compose(definition, children);
        }
        return compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(function (child) {
            return child instanceof BaseComponent_1.BaseComponent;
        })), children);
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));

},{"./Builder":3,"./component/BaseComponent":4,"./event/listener":13}],12:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var symbol_observable_1 = require("symbol-observable");

var SubscriptionImpl = function () {
    function SubscriptionImpl(activeSubscriptions, subscriber, observerType) {
        _classCallCheck(this, SubscriptionImpl);

        this.activeSubscriptions = activeSubscriptions;
        this.subscriber = subscriber;
        this.observerType = observerType;
        this.innerSubscriptions = [];
        this.activeSubscriptions.add(this);
    }

    _createClass(SubscriptionImpl, [{
        key: "buildSubscription",
        value: function buildSubscription(func) {
            this.innerSubscriptions.forEach(function (subscription) {
                return subscription();
            });
            this.innerSubscriptions = func(this.subscriber, this.observerType);
        }
    }, {
        key: "unsubscribe",
        value: function unsubscribe() {
            this.innerSubscriptions.forEach(function (subscription) {
                return subscription();
            });
            this.activeSubscriptions.delete(this);
        }
    }]);

    return SubscriptionImpl;
}();

var ObservationNode = function () {
    function ObservationNode(domNode) {
        var observationProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var defaultEmitter = arguments[2];

        _classCallCheck(this, ObservationNode);

        this.domNode = domNode;
        this.observationProperties = observationProperties;
        this.defaultEmitter = defaultEmitter;
        this.childSeq = 0;
        this.children = new Map();
        this.activeSubscriptions = new Set();
    }

    _createClass(ObservationNode, [{
        key: "append",
        value: function append(child) {
            if (child.idx != null) {
                throw new Error('Observation node cannot be appended since it already has a parent.');
            }
            child.idx = ++this.childSeq;
            child.parent = this;
            this.children.set(child.idx, child);
            this.rebuildDependentSubscriptions();
        }
    }, {
        key: "remove",
        value: function remove(child) {
            if (child.idx != null) {
                this.children.delete(child.idx);
                delete child.idx;
                delete child.parent;
                this.rebuildDependentSubscriptions();
            }
        }
    }, {
        key: "createObservable",
        value: function createObservable(observedType) {
            var _this = this;

            return _defineProperty({
                subscribe: function subscribe(subscriber) {
                    return _this.rebuildSubscription(new SubscriptionImpl(_this.activeSubscriptions, subscriber, observedType));
                }
            }, symbol_observable_1.default, function () {
                return this;
            });
        }
    }, {
        key: "rebuildSubscription",
        value: function rebuildSubscription(subscription) {
            var _this2 = this;

            subscription.buildSubscription(function (subscriber, observedType) {
                return _this2.collectSubscriptions(subscriber, observedType);
            });
            return subscription;
        }
    }, {
        key: "rebuildSubscriptions",
        value: function rebuildSubscriptions() {
            var _this3 = this;

            this.activeSubscriptions.forEach(function (subscription) {
                return _this3.rebuildSubscription(subscription);
            });
        }
    }, {
        key: "rebuildDependentSubscriptions",
        value: function rebuildDependentSubscriptions() {
            var observationNode = this;
            while (observationNode) {
                observationNode.rebuildSubscriptions();
                observationNode = observationNode.parent;
            }
        }
    }, {
        key: "collectSubscriptions",
        value: function collectSubscriptions(subscriber, observedType) {
            var _this4 = this;

            var defaultEmitter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.defaultEmitter;

            var subscriptions = [];
            if (this.domNode) {
                Object.keys(this.observationProperties).map(function (domEvent) {
                    var _observationPropertie = _this4.observationProperties[domEvent],
                        emitter = _observationPropertie.emitter,
                        eventType = _observationPropertie.eventType;

                    if (observedType == null || observedType === eventType) {
                        var handler = function handler(e) {
                            return subscriber.next({
                                eventType: eventType,
                                payload: (emitter || defaultEmitter || function () {
                                    return null;
                                })(e)
                            });
                        };
                        _this4.domNode.addEventListener(domEvent, handler);
                        subscriptions.push(function () {
                            return _this4.domNode.removeEventListener(domEvent, handler);
                        });
                    }
                });
            }
            var buffer = [];
            this.children.forEach(function (observationNode) {
                return buffer.push(observationNode.collectSubscriptions(subscriber, observedType, defaultEmitter));
            });
            var array = [].concat.apply(subscriptions, buffer);
            return array;
        }
    }]);

    return ObservationNode;
}();

exports.ObservationNode = ObservationNode;

},{"symbol-observable":1}],13:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var Listener = function () {
    function Listener(stream) {
        var _this = this;

        _classCallCheck(this, Listener);

        this.stream = stream;
        this.childListeners = new Map();
        this.consumer = new Map();
        this.subscription = stream.subscribe({
            next: function next(_ref) {
                var eventType = _ref.eventType,
                    payload = _ref.payload;

                var processingFunc = _this.consumer.get(eventType);
                if (processingFunc) {
                    _this.childListeners.forEach(function (childListener) {
                        return childListener && childListener.dispose();
                    });
                    var listener = processingFunc(payload);
                    listener instanceof Listener && _this.childListeners.set(processingFunc, listener);
                }
            },
            error: function error(e) {},
            complete: function complete() {}
        });
    }

    _createClass(Listener, [{
        key: "dispose",
        value: function dispose() {
            this.subscription && this.subscription.unsubscribe();
            this.childListeners.forEach(function (listener) {
                return listener && listener.dispose();
            });
        }
    }, {
        key: "on",
        value: function on(eventType) {
            var _this2 = this;

            return {
                execute: function execute(func) {
                    _this2.consumer.set(eventType, func);
                }
            };
        }
    }], [{
        key: "create",
        value: function create(stream) {
            return new Listener(stream);
        }
    }]);

    return Listener;
}();

exports.Listener = Listener;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var NativeUtil;
(function (NativeUtil) {
    function toCamelCase(key) {
        return key.replace(/((-?)\w+)/g, function (match, index) {
            if (match.charAt(0) === '-') {
                return "" + match.charAt(1).toUpperCase() + match.substr(2).toLowerCase();
            } else {
                return match.toLowerCase();
            }
        });
    }
    function stringToStyleObject(style) {
        var regEx = /(\w+(-\w+)*)\s*:\s*(\w*(\s|\w)*\w)/g;
        var obj = {};
        for (var result = regEx.exec(style); result !== null; result = regEx.exec(style)) {
            var key = toCamelCase(result[1]);
            var value = result[3];
            obj[key] = value;
        }
        return obj;
    }
    function applyClass(element, classProp) {
        classProp.split(' ').forEach(function (_class) {
            return element.classList.add(_class);
        });
    }
    NativeUtil.applyClass = applyClass;
    function applyStyle(element, style) {
        if (typeof style === 'string') {
            var styleObj = stringToStyleObject(style);
        } else {
            styleObj = Object.assign({}, style);
        }
        var elementStyle = element.style;
        Object.keys(styleObj).forEach(function (key) {
            return elementStyle[key] = styleObj[key];
        });
    }
    NativeUtil.applyStyle = applyStyle;
    function applyProperties(element, properties) {
        /* The 'type' is better to set before others */
        if (properties[const_1.NATIVE_PROPERTIES.TYPE]) {
            element[const_1.NATIVE_PROPERTIES.TYPE] = properties[const_1.NATIVE_PROPERTIES.TYPE];
        }
        Object.keys(properties).forEach(function (prop) {
            if (prop === const_1.NATIVE_PROPERTIES.TYPE) {
                return;
            }
            var propValue = properties[prop];
            if (prop.startsWith('on') && typeof propValue === 'function') {
                element.addEventListener(prop.substr(2), propValue);
            } else {
                element[prop] = propValue;
            }
        });
    }
    NativeUtil.applyProperties = applyProperties;
})(NativeUtil = exports.NativeUtil || (exports.NativeUtil = {}));

},{"./const":16}],15:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var PropertiesUtil;
(function (PropertiesUtil) {
    function getDataNodeProperties(properties) {
        return {
            id: properties[const_1.DATA_NODE_PROPERTIES.ID],
            name: properties[const_1.DATA_NODE_PROPERTIES.NAME]
        };
    }
    PropertiesUtil.getDataNodeProperties = getDataNodeProperties;
    function getTransformer(properties) {
        var type = properties[const_1.SPECIFIC_PROPERTIES.VALUE_TYPE];
        switch (type) {
            case 'number':
                return function (value) {
                    return parseInt(value);
                };
            case 'number.float':
                return function (value) {
                    return parseFloat(value);
                };
            default:
                return function (value) {
                    return value;
                };
        }
    }
    PropertiesUtil.getTransformer = getTransformer;
    function getGenerator(properties) {
        var generator = properties[const_1.SPECIFIC_PROPERTIES.GENERATOR];
        if (typeof generator === 'function') {
            return generator;
        }
    }
    PropertiesUtil.getGenerator = getGenerator;
    function getStyleProperties(properties) {
        return {
            class: properties[const_1.STYLE_PROPERTIES.CLASS],
            style: properties[const_1.STYLE_PROPERTIES.STYLE]
        };
    }
    PropertiesUtil.getStyleProperties = getStyleProperties;
    function getNativeProperties(properties) {
        var nativeProps = Object.assign({}, properties);
        delete nativeProps[const_1.DATA_NODE_PROPERTIES.ID];
        delete nativeProps[const_1.SPECIFIC_PROPERTIES.VALUE_TYPE];
        delete nativeProps[const_1.SPECIFIC_PROPERTIES.GENERATOR];
        delete nativeProps[const_1.STYLE_PROPERTIES.CLASS];
        delete nativeProps[const_1.STYLE_PROPERTIES.STYLE];
        return nativeProps;
    }
    PropertiesUtil.getNativeProperties = getNativeProperties;
    function getObservationProperties(properties) {
        var observationProperties = {};
        Object.keys(properties).forEach(function (prop) {
            var propValue = properties[prop];
            if (prop.startsWith('on') && (typeof propValue === "undefined" ? "undefined" : _typeof(propValue)) === 'object') {
                observationProperties[prop.substr(2)] = Object.assign({}, propValue);
            }
        });
        return observationProperties;
    }
    PropertiesUtil.getObservationProperties = getObservationProperties;
})(PropertiesUtil = exports.PropertiesUtil || (exports.PropertiesUtil = {}));

},{"./const":16}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODES = {
    DIV: 'div',
    FORM: 'form',
    LABEL: 'label',
    SPAN: 'span',
    UL: 'ul',
    OL: 'ol',
    LI: 'li',
    P: 'p',
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    H4: 'h4',
    H5: 'h5',
    H6: 'h6',
    IMG: 'img',
    A: 'a',
    INPUT: 'input',
    TEXTAREA: 'textarea',
    BUTTON: 'button',
    SELECT: 'select',
    OPTION: 'option',
    BR: 'br'
};
exports.DATA_NODE_PROPERTIES = {
    ID: 'id',
    NAME: 'name'
};
exports.SPECIFIC_PROPERTIES = {
    VALUE_TYPE: 'value-type',
    GENERATOR: 'generator'
};
exports.STYLE_PROPERTIES = {
    CLASS: 'class',
    STYLE: 'style'
};
exports.NATIVE_PROPERTIES = {
    TYPE: 'type'
};

},{}]},{},[11])(11)
});
