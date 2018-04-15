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
var generator_1 = require("./component/generator");
var GroupContainer_1 = require("./component/GroupContainer");
var HtmlComponents_1 = require("./component/HtmlComponents");
var ListContainer_1 = require("./component/ListContainer");
var TextComponent_1 = require("./component/TextComponent");
var const_1 = require("./util/const");
var NativeUtil_1 = require("./util/NativeUtil");
var PropertiesReader_1 = require("./util/PropertiesReader");
var DomFactory;
(function (DomFactory) {
    function createElement(tag, nativeProperties) {
        var element = document.createElement(tag);
        NativeUtil_1.NativeUtil.applyProperties(element, nativeProperties);
        return element;
    }
    DomFactory.createElement = createElement;
})(DomFactory || (DomFactory = {}));
var Builder;
(function (Builder) {
    function createContainer(tag, propReader) {
        return new Container_1.Container(DomFactory.createElement(tag, propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createHtmlComponent(tag, propReader) {
        return new HtmlComponents_1.HtmlElementComponent(DomFactory.createElement(tag, propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createInputComponent(propReader) {
        var dataNodeProperties = propReader.dataNodeProperties,
            bindProperties = propReader.bindProperties,
            nativeProperties = propReader.nativeProperties,
            observationProperties = propReader.observationProperties;

        var element = DomFactory.createElement('input', nativeProperties);
        switch (nativeProperties[const_1.NATIVE_PROPERTIES.TYPE] || '') {
            case 'checkbox':
                return new HtmlComponents_1.CheckBoxInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
            case 'radio':
                return new HtmlComponents_1.RadioInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
            default:
                return new HtmlComponents_1.TextInputComponent(element, dataNodeProperties, bindProperties, observationProperties);
        }
    }
    function createSelectComponent(propReader) {
        return new HtmlComponents_1.SelectComponent(DomFactory.createElement('select', propReader.nativeProperties), propReader.dataNodeProperties, propReader.bindProperties, propReader.observationProperties);
    }
    function createComponent(tag, properties, hasChildren) {
        var propReader = PropertiesReader_1.PropertiesReader.create(properties);
        switch (tag) {
            case const_1.NODES.DIV:
            case const_1.NODES.UL:
            case const_1.NODES.OL:
            case const_1.NODES.LI:
            case const_1.NODES.FORM:
                return (hasChildren ? createContainer : createHtmlComponent)(tag, propReader);
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
                return createHtmlComponent(tag, propReader);
            case const_1.NODES.INPUT:
            case const_1.NODES.TEXTAREA:
                return createInputComponent(propReader);
            case const_1.NODES.SELECT:
                return createSelectComponent(propReader);
        }
        throw new Error("'" + tag + "' not supported");
    }
    Builder.createComponent = createComponent;
    function createList(properties, children) {
        var _PropertiesReader_1$P = PropertiesReader_1.PropertiesReader.create(properties),
            dataNodeProperties = _PropertiesReader_1$P.dataNodeProperties,
            nativeProperties = _PropertiesReader_1$P.nativeProperties;

        return new ListContainer_1.ListContainer(generator_1.createGenerator(children), dataNodeProperties, nativeProperties);
    }
    Builder.createList = createList;
    function createGroup(properties) {
        var _PropertiesReader_1$P2 = PropertiesReader_1.PropertiesReader.create(properties),
            dataNodeProperties = _PropertiesReader_1$P2.dataNodeProperties,
            nativeProperties = _PropertiesReader_1$P2.nativeProperties;

        return new GroupContainer_1.GroupContainer(dataNodeProperties, nativeProperties);
    }
    Builder.createGroup = createGroup;
    function createText(properties) {
        var _PropertiesReader_1$P3 = PropertiesReader_1.PropertiesReader.create(properties),
            dataNodeProperties = _PropertiesReader_1$P3.dataNodeProperties,
            bindProperties = _PropertiesReader_1$P3.bindProperties,
            nativeProperties = _PropertiesReader_1$P3.nativeProperties;

        return new TextComponent_1.TextComponent(dataNodeProperties, bindProperties, nativeProperties);
    }
    Builder.createText = createText;
})(Builder = exports.Builder || (exports.Builder = {}));

},{"./component/Container":5,"./component/GroupContainer":7,"./component/HtmlComponents":8,"./component/ListContainer":9,"./component/TextComponent":10,"./component/generator":13,"./util/NativeUtil":17,"./util/PropertiesReader":18,"./util/const":19}],4:[function(require,module,exports){
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
        this.children = [];
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
            this.children.push(child);
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
            this.domWrapper.removeChild(child.domWrapper);
            var idx = this.children.indexOf(child);
            if (idx >= 0) {
                this.children.splice(idx, 1);
            }
        }
    }, {
        key: "createObservable",
        value: function createObservable(observedEvent) {
            return this.observationNode.createObservable(observedEvent);
        }
    }, {
        key: "cloneComponent",
        value: function cloneComponent() {
            var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var copy = this.prepareCopy();
            deep && this.children.forEach(function (child) {
                if (child instanceof BaseComponent) {
                    copy.append(child.cloneComponent());
                } else {
                    copy.append(child);
                }
            });
            return copy;
        }
    }, {
        key: "id",
        get: function get() {
            return this.domWrapper.id;
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

        _this.dataNode = new DataNode_1.DataNode(dataNodeProps, _this);
        _this.observationNode = new ObservationNode_1.ObservationNode(_this.dataNode, observationProperties);
        return _this;
    }

    return DataDrivenComponentImpl;
}(BaseComponent);

exports.DataDrivenComponentImpl = DataDrivenComponentImpl;

},{"../event/ObservationNode":15,"./DataNode":6}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DomBinder_1 = require("./dom/DomBinder");
var DomWrappers_1 = require("./dom/DomWrappers");
/**
 * Basic element.
 * @template E The type of DOM node.
 */

var Container = function (_BaseComponent_1$Data) {
    _inherits(Container, _BaseComponent_1$Data);

    function Container(element, dataNodeProps, bindProperties, observationProperties) {
        _classCallCheck(this, Container);

        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, DomWrappers_1.DomWrappers.simple(element), dataNodeProps, observationProperties));

        _this.element = element;
        _this.dataNodeProps = dataNodeProps;
        _this.bindProperties = bindProperties;
        _this.observationProperties = observationProperties;
        _this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
        return _this;
    }

    _createClass(Container, [{
        key: "setData",
        value: function setData(data) {
            this.domBinder.setTo(data, this.domNode);
            this.dataNode.setData(data);
        }
    }, {
        key: "getData",
        value: function getData() {
            return Object.assign({}, this.domBinder.getFrom(this.domNode), this.dataNode.getData());
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
    }, {
        key: "prepareCopy",
        value: function prepareCopy() {
            return new this.constructor(this.element.cloneNode(), this.dataNodeProps, this.bindProperties, this.observationProperties);
        }
    }]);

    return Container;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.Container = Container;

},{"./BaseComponent":4,"./dom/DomBinder":11,"./dom/DomWrappers":12}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var DataMappingBehavior;
(function (DataMappingBehavior) {
    DataMappingBehavior[DataMappingBehavior["Named"] = 0] = "Named";
    DataMappingBehavior[DataMappingBehavior["Spread"] = 1] = "Spread";
    DataMappingBehavior[DataMappingBehavior["Search"] = 2] = "Search";
})(DataMappingBehavior = exports.DataMappingBehavior || (exports.DataMappingBehavior = {}));

var DataNode = function () {
    function DataNode() {
        var dataNodeProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var component = arguments[1];

        _classCallCheck(this, DataNode);

        this.dataNodeProperties = dataNodeProperties;
        this.component = component;
        this.children = new Set();
    }

    _createClass(DataNode, [{
        key: "append",
        value: function append(dataNode) {
            if (dataNode.parent != null) {
                throw new Error('Data node cannot be appended since it already has a parent.');
            }
            dataNode.parent = this;
            this.children.add(dataNode);
        }
    }, {
        key: "remove",
        value: function remove(dataNode) {
            if (dataNode.parent === this) {
                this.children.delete(dataNode);
                delete dataNode.parent;
            }
        }
    }, {
        key: "getMinimalNamedComponent",
        value: function getMinimalNamedComponent() {
            if (this.name) {
                return this.component;
            }
            var dataNode = this;
            var parentDataNode = dataNode.parent;
            while (true) {
                if (!parentDataNode || parentDataNode.name) {
                    return dataNode.component;
                }
                dataNode = parentDataNode;
                parentDataNode = dataNode.parent;
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
            if (!id) {
                return;
            }
            if (this.component.id === id) {
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
        value: function getDataRecursive(data) {
            this.children.forEach(function (childDataNode) {
                var name = childDataNode.name,
                    component = childDataNode.component,
                    dataBehavior = childDataNode.dataBehavior;

                switch (dataBehavior) {
                    case DataMappingBehavior.Named:
                        if (data[name] == null) {
                            data[name] = component.getData();
                        }
                        break;
                    case DataMappingBehavior.Spread:
                        var childData = component.getData() || {};
                        Object.keys(childData).forEach(function (n) {
                            return data[n] = childData[n];
                        });
                        break;
                    case DataMappingBehavior.Search:
                        childDataNode.getDataRecursive(data);
                        break;
                }
            });
            return data;
        }
    }, {
        key: "setDataRecursive",
        value: function setDataRecursive(data) {
            this.children.forEach(function (childDataNode) {
                var name = childDataNode.name,
                    component = childDataNode.component,
                    dataBehavior = childDataNode.dataBehavior;

                switch (dataBehavior) {
                    case DataMappingBehavior.Named:
                        return component.setData(data[name]);
                    case DataMappingBehavior.Spread:
                        return component.setData(data);
                    case DataMappingBehavior.Search:
                        return childDataNode.setDataRecursive(data);
                }
            });
        }
    }, {
        key: "name",
        get: function get() {
            return this.dataNodeProperties.name;
        }
    }, {
        key: "dataBehavior",
        get: function get() {
            return this.dataNodeProperties.dataBehavior || (this.name ? DataMappingBehavior.Named : DataMappingBehavior.Search);
        }
    }]);

    return DataNode;
}();

exports.DataNode = DataNode;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../util/const");
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./dom/DomWrappers");

var GroupContainer = function (_BaseComponent_1$Data) {
    _inherits(GroupContainer, _BaseComponent_1$Data);

    function GroupContainer(dataNodeProps, nativeProperties) {
        _classCallCheck(this, GroupContainer);

        var _this = _possibleConstructorReturn(this, (GroupContainer.__proto__ || Object.getPrototypeOf(GroupContainer)).call(this, DomWrappers_1.DomWrappers.group(), dataNodeProps));

        _this.dataNodeProps = dataNodeProps;
        _this.nativeProperties = nativeProperties;
        return _this;
    }

    _createClass(GroupContainer, [{
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
    }, {
        key: "prepareCopy",
        value: function prepareCopy() {
            return new this.constructor(this.dataNodeProps);
        }
    }, {
        key: "id",
        get: function get() {
            return this.nativeProperties && this.nativeProperties[const_1.NATIVE_PROPERTIES.ID];
        }
    }]);

    return GroupContainer;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.GroupContainer = GroupContainer;

},{"../util/const":19,"./BaseComponent":4,"./dom/DomWrappers":12}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var DataNode_1 = require("./DataNode");
var DomBinder_1 = require("./dom/DomBinder");
var DomWrappers_1 = require("./dom/DomWrappers");

var HtmlComponent = function (_BaseComponent_1$Data) {
    _inherits(HtmlComponent, _BaseComponent_1$Data);

    function HtmlComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, HtmlComponent);

        var _this = _possibleConstructorReturn(this, (HtmlComponent.__proto__ || Object.getPrototypeOf(HtmlComponent)).call(this, DomWrappers_1.DomWrappers.simple(element), dataNodeProperties, observationProperties));

        _this.element = element;
        _this.dataNodeProperties = dataNodeProperties;
        _this.bindProperties = bindProperties;
        _this.observationProperties = observationProperties;
        _this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
        return _this;
    }

    _createClass(HtmlComponent, [{
        key: "prepareCopy",
        value: function prepareCopy() {
            return new this.constructor(this.element.cloneNode(), this.dataNodeProperties, this.bindProperties, this.observationProperties);
        }
    }]);

    return HtmlComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.HtmlComponent = HtmlComponent;

var HtmlElementComponent = function (_HtmlComponent) {
    _inherits(HtmlElementComponent, _HtmlComponent);

    function HtmlElementComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, HtmlElementComponent);

        return _possibleConstructorReturn(this, (HtmlElementComponent.__proto__ || Object.getPrototypeOf(HtmlElementComponent)).call(this, element, dataNodeProperties, bindProperties, observationProperties));
    }

    _createClass(HtmlElementComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            if (this.domBinder.isDefault()) {
                var set = this.domBinder.getDefaultBinder().set;
                set && this.setDefaultValue(set(data));
            } else {
                this.domBinder.setTo(data, this.domNode);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            if (this.domBinder.isDefault()) {
                var get = this.domBinder.getDefaultBinder().get;
                return get && get(this.getDefaultValue());
            } else {
                return this.domBinder.getFrom(this.domNode);
            }
        }
    }, {
        key: "setDefaultValue",
        value: function setDefaultValue(value) {
            this.domWrapper.domElement.textContent = value;
        }
    }, {
        key: "getDefaultValue",
        value: function getDefaultValue() {
            return this.domWrapper.domElement.textContent;
        }
    }]);

    return HtmlElementComponent;
}(HtmlComponent);

exports.HtmlElementComponent = HtmlElementComponent;

var TextInputComponent = function (_HtmlComponent2) {
    _inherits(TextInputComponent, _HtmlComponent2);

    function TextInputComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, TextInputComponent);

        return _possibleConstructorReturn(this, (TextInputComponent.__proto__ || Object.getPrototypeOf(TextInputComponent)).call(this, element, dataNodeProperties, bindProperties, observationProperties));
    }

    _createClass(TextInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var set = this.domBinder.getDefaultBinder().set;
            if (set) {
                this.domWrapper.domElement.value = set(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var get = this.domBinder.getDefaultBinder().get;
            return get && get(this.domWrapper.domElement.value);
        }
    }]);

    return TextInputComponent;
}(HtmlComponent);

exports.TextInputComponent = TextInputComponent;

var CheckBoxInputComponent = function (_HtmlComponent3) {
    _inherits(CheckBoxInputComponent, _HtmlComponent3);

    function CheckBoxInputComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, CheckBoxInputComponent);

        return _possibleConstructorReturn(this, (CheckBoxInputComponent.__proto__ || Object.getPrototypeOf(CheckBoxInputComponent)).call(this, element, dataNodeProperties, bindProperties, observationProperties));
    }

    _createClass(CheckBoxInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var set = this.domBinder.getDefaultBinder().set;
            if (set) {
                this.domWrapper.domElement.checked = set(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var get = this.domBinder.getDefaultBinder().get;
            return get && get(this.domWrapper.domElement.checked);
        }
    }]);

    return CheckBoxInputComponent;
}(HtmlComponent);

exports.CheckBoxInputComponent = CheckBoxInputComponent;

var SelectComponent = function (_HtmlComponent4) {
    _inherits(SelectComponent, _HtmlComponent4);

    function SelectComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, SelectComponent);

        return _possibleConstructorReturn(this, (SelectComponent.__proto__ || Object.getPrototypeOf(SelectComponent)).call(this, element, dataNodeProperties, bindProperties, observationProperties));
    }

    _createClass(SelectComponent, [{
        key: "setData",
        value: function setData() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var set = this.domBinder.getDefaultBinder().set;
            if (set == null) {
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

                        values[set(t)] = true;
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
                values[set(data)] = true;
            }
            for (var i = 0; i < options.length; i++) {
                var opt = options.item(i);
                opt.selected = values[opt.value] === true;
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var get = this.domBinder.getDefaultBinder().get;
            if (get == null) {
                return;
            }
            var data = [];
            var options = this.domWrapper.domElement.options;

            for (var i = 0; i < options.length; i++) {
                var opt = options.item(i);
                if (opt.selected) {
                    data.push(get(opt.value));
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
}(HtmlComponent);

exports.SelectComponent = SelectComponent;

var RadioInputComponent = function (_HtmlComponent5) {
    _inherits(RadioInputComponent, _HtmlComponent5);

    function RadioInputComponent(element) {
        var dataNodeProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var bindProperties = arguments[2];
        var observationProperties = arguments[3];

        _classCallCheck(this, RadioInputComponent);

        return _possibleConstructorReturn(this, (RadioInputComponent.__proto__ || Object.getPrototypeOf(RadioInputComponent)).call(this, element, dataNodeProperties, bindProperties, observationProperties));
    }

    _createClass(RadioInputComponent, [{
        key: "setData",
        value: function setData(data) {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var set = this.domBinder.getDefaultBinder().set;
            if (set == null) {
                return;
            }
            var radioInput = this.domWrapper.domElement;
            radioInput.checked = radioInput.value === set(data);
        }
    }, {
        key: "getData",
        value: function getData() {
            if (this.dataNode.dataBehavior === DataNode_1.DataMappingBehavior.Search) {
                return;
            }
            var get = this.domBinder.getDefaultBinder().get;
            if (get == null) {
                return;
            }
            var radioInput = this.domWrapper.domElement;
            if (radioInput.checked) {
                return get(radioInput.value);
            }
        }
    }]);

    return RadioInputComponent;
}(HtmlComponent);

exports.RadioInputComponent = RadioInputComponent;

},{"./BaseComponent":4,"./DataNode":6,"./dom/DomBinder":11,"./dom/DomWrappers":12}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../util/const");
var BaseComponent_1 = require("./BaseComponent");
var DomWrappers_1 = require("./dom/DomWrappers");

var ListContainer = function (_BaseComponent_1$Data) {
    _inherits(ListContainer, _BaseComponent_1$Data);

    function ListContainer(generator, dataNodeProps, nativeProperties) {
        _classCallCheck(this, ListContainer);

        var _this = _possibleConstructorReturn(this, (ListContainer.__proto__ || Object.getPrototypeOf(ListContainer)).call(this, DomWrappers_1.DomWrappers.group(), dataNodeProps));

        _this.generator = generator;
        _this.dataNodeProps = dataNodeProps;
        _this.nativeProperties = nativeProperties;
        return _this;
    }

    _createClass(ListContainer, [{
        key: "append",
        value: function append(child) {
            if (!(child instanceof BaseComponent_1.BaseComponent)) {
                throw new Error('List can only append component');
            }
            _get(ListContainer.prototype.__proto__ || Object.getPrototypeOf(ListContainer.prototype), "append", this).call(this, child);
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
            data.forEach(function (dataItem) {
                var child = _this2.generator();
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
    }, {
        key: "prepareCopy",
        value: function prepareCopy() {
            return new this.constructor(this.generator, this.dataNodeProps);
        }
    }, {
        key: "id",
        get: function get() {
            return this.nativeProperties && this.nativeProperties[const_1.NATIVE_PROPERTIES.ID];
        }
    }]);

    return ListContainer;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.ListContainer = ListContainer;

},{"../util/const":19,"./BaseComponent":4,"./dom/DomWrappers":12}],10:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../util/const");
var BaseComponent_1 = require("./BaseComponent");
var DomBinder_1 = require("./dom/DomBinder");
var DomWrappers_1 = require("./dom/DomWrappers");

var TextComponent = function (_BaseComponent_1$Data) {
    _inherits(TextComponent, _BaseComponent_1$Data);

    function TextComponent(dataNodeProps, bindProperties, nativeProperties) {
        _classCallCheck(this, TextComponent);

        var _this = _possibleConstructorReturn(this, (TextComponent.__proto__ || Object.getPrototypeOf(TextComponent)).call(this, DomWrappers_1.DomWrappers.text(), dataNodeProps));

        _this.dataNodeProps = dataNodeProps;
        _this.bindProperties = bindProperties;
        _this.nativeProperties = nativeProperties;
        _this.domBinder = DomBinder_1.DomBinder.create(bindProperties);
        return _this;
    }

    _createClass(TextComponent, [{
        key: "setData",
        value: function setData(data) {
            if (!this.dataNode.name) {
                return;
            }
            var set = this.domBinder.getDefaultBinder().set;
            if (set) {
                this.domWrapper.domElement.data = set(data);
            }
        }
    }, {
        key: "getData",
        value: function getData() {
            if (!this.dataNode.name) {
                return;
            }
            var get = this.domBinder.getDefaultBinder().get;
            return get && get(this.domWrapper.domElement.data);
        }
    }, {
        key: "prepareCopy",
        value: function prepareCopy() {
            return new this.constructor(this.dataNodeProps, this.bindProperties);
        }
    }, {
        key: "id",
        get: function get() {
            return this.nativeProperties && this.nativeProperties[const_1.NATIVE_PROPERTIES.ID];
        }
    }]);

    return TextComponent;
}(BaseComponent_1.DataDrivenComponentImpl);

exports.TextComponent = TextComponent;

},{"../util/const":19,"./BaseComponent":4,"./dom/DomBinder":11,"./dom/DomWrappers":12}],11:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var NativeUtil_1 = require("../../util/NativeUtil");
exports.DEFAULT_BIND = '____DEFAULT';

var DomBinder = function () {
    function DomBinder(properties) {
        _classCallCheck(this, DomBinder);

        this.properties = properties;
        this.names = Object.keys(properties).filter(function (name) {
            return name !== exports.DEFAULT_BIND;
        });
    }

    _createClass(DomBinder, [{
        key: "isDefault",
        value: function isDefault() {
            return this.names.length === 0 && this.getDefaultBinder() != null;
        }
    }, {
        key: "getDefaultBinder",
        value: function getDefaultBinder() {
            return this.properties[exports.DEFAULT_BIND];
        }
    }, {
        key: "setTo",
        value: function setTo(data, node) {
            var _this = this;

            this.names.filter(function (name) {
                return _this.properties[name].set != null;
            }).forEach(function (name) {
                NativeUtil_1.NativeUtil.applyProperty(node, { name: name, value: _this.properties[name].set(data[name]) });
            });
        }
    }, {
        key: "getFrom",
        value: function getFrom(node) {
            var _this2 = this;

            return this.names.filter(function (name) {
                return _this2.properties[name].get != null;
            }).reduce(function (data, name) {
                return Object.assign({}, data, _defineProperty({}, name, _this2.properties[name].get(NativeUtil_1.NativeUtil.extractProperty(node, name))));
            }, {});
        }
    }], [{
        key: "create",
        value: function create() {
            var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (properties[exports.DEFAULT_BIND]) {
                return new DomBinder(Object.assign({}, properties));
            } else {
                return new DomBinder(Object.assign({}, properties, _defineProperty({}, exports.DEFAULT_BIND, DomBinder.IDENTITY_BINDER)));
            }
        }
    }]);

    return DomBinder;
}();

DomBinder.IDENTITY_BINDER = {
    get: function get(v) {
        return v;
    },
    set: function set(v) {
        return v;
    }
};
DomBinder.INT_BINDER = {
    set: function set(n) {
        return n == null ? '' : "" + n;
    },
    get: function get(v) {
        return parseInt(v);
    }
};
exports.DomBinder = DomBinder;

},{"../../util/NativeUtil":17}],12:[function(require,module,exports){
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var DomWrappers;
(function (DomWrappers) {
    var AbstractDomWrapper = function () {
        function AbstractDomWrapper(domElement) {
            _classCallCheck(this, AbstractDomWrapper);

            this.domElement = domElement;
        }

        _createClass(AbstractDomWrapper, [{
            key: "provideParent",
            value: function provideParent(parent) {
                this.parentDomWrapper = parent;
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                if (child instanceof AbstractDomWrapper) {
                    child.detach();
                }
            }
        }, {
            key: "clone",
            value: function clone() {
                var domCopy = this.domElement && this.domElement.cloneNode();
                return new this.constructor(domCopy);
            }
        }]);

        return AbstractDomWrapper;
    }();

    function simple(element) {
        return new SimpleDomWrapper(element);
    }
    DomWrappers.simple = simple;
    function group() {
        return new GroupWrapper();
    }
    DomWrappers.group = group;
    function text() {
        var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        return new TextWrapper(document.createTextNode(str));
    }
    DomWrappers.text = text;

    var SimpleDomWrapper = function (_AbstractDomWrapper) {
        _inherits(SimpleDomWrapper, _AbstractDomWrapper);

        function SimpleDomWrapper(domElement) {
            _classCallCheck(this, SimpleDomWrapper);

            return _possibleConstructorReturn(this, (SimpleDomWrapper.__proto__ || Object.getPrototypeOf(SimpleDomWrapper)).call(this, domElement));
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
            key: "detach",
            value: function detach() {
                var parentNode = this.domElement.parentNode;

                if (this.parentDomWrapper && parentNode) {
                    parentNode.removeChild(this.domElement);
                }
            }
        }, {
            key: "id",
            get: function get() {
                return this.domElement.id;
            },
            set: function set(id) {
                this.domElement.id = id;
            }
        }]);

        return SimpleDomWrapper;
    }(AbstractDomWrapper);

    var START_PLACEHOLDER = 'START';
    var END_PLACEHOLDER = 'END';

    var GroupWrapper = function (_AbstractDomWrapper2) {
        _inherits(GroupWrapper, _AbstractDomWrapper2);

        function GroupWrapper() {
            _classCallCheck(this, GroupWrapper);

            var _this2 = _possibleConstructorReturn(this, (GroupWrapper.__proto__ || Object.getPrototypeOf(GroupWrapper)).call(this));

            _this2.startPlaceholder = document.createComment(START_PLACEHOLDER);
            _this2.endPlaceholder = document.createComment(END_PLACEHOLDER);
            _this2.children = new Set();
            return _this2;
        }

        _createClass(GroupWrapper, [{
            key: "appendChild",
            value: function appendChild(child) {
                this.children.add(child);
                this.fireAppend(child);
            }
        }, {
            key: "provideParent",
            value: function provideParent(parent) {
                var _this3 = this;

                _get(GroupWrapper.prototype.__proto__ || Object.getPrototypeOf(GroupWrapper.prototype), "provideParent", this).call(this, parent);
                if (!this.domParent) {
                    return;
                }
                if (parent instanceof GroupWrapper) {
                    this.domParent.insertBefore(this.startPlaceholder, parent.endPlaceholder);
                    this.domParent.insertBefore(this.endPlaceholder, parent.endPlaceholder);
                } else {
                    this.domParent.appendChild(this.startPlaceholder);
                    this.domParent.appendChild(this.endPlaceholder);
                }
                this.children.forEach(function (child) {
                    return _this3.fireAppend(child);
                });
            }
        }, {
            key: "removeChild",
            value: function removeChild(child) {
                this.children.delete(child);
                _get(GroupWrapper.prototype.__proto__ || Object.getPrototypeOf(GroupWrapper.prototype), "removeChild", this).call(this, child);
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
            key: "fireAppend",
            value: function fireAppend(child) {
                if (!this.domParent) {
                    return;
                }
                if (typeof child === 'string') {
                    var childNode = document.createTextNode(child);
                } else {
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
        }, {
            key: "domParent",
            get: function get() {
                var parentWrapper = this.parentDomWrapper;
                while (parentWrapper) {
                    if (parentWrapper.domElement) {
                        return parentWrapper.domElement;
                    } else {
                        parentWrapper = parentWrapper.parentDomWrapper;
                    }
                }
            }
        }]);

        return GroupWrapper;
    }(AbstractDomWrapper);

    var TextWrapper = function (_AbstractDomWrapper3) {
        _inherits(TextWrapper, _AbstractDomWrapper3);

        function TextWrapper(domElement) {
            _classCallCheck(this, TextWrapper);

            return _possibleConstructorReturn(this, (TextWrapper.__proto__ || Object.getPrototypeOf(TextWrapper)).call(this, domElement));
        }

        _createClass(TextWrapper, [{
            key: "appendChild",
            value: function appendChild(child) {}
        }, {
            key: "detach",
            value: function detach() {
                var parentNode = this.domElement.parentNode;

                parentNode && parentNode.removeChild(this.domElement);
            }
        }]);

        return TextWrapper;
    }(AbstractDomWrapper);
})(DomWrappers = exports.DomWrappers || (exports.DomWrappers = {}));

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("./BaseComponent");
var GroupContainer_1 = require("./GroupContainer");
exports.createGenerator = function (content) {
    return function () {
        if (content.length > 1) {
            var group = new GroupContainer_1.GroupContainer();
            content.forEach(function (child) {
                if (child instanceof BaseComponent_1.BaseComponent) {
                    group.append(child.cloneComponent());
                } else {
                    group.append(child);
                }
            });
            return group;
        }
        var component = content[0];
        if (component instanceof BaseComponent_1.BaseComponent) {
            return component.cloneComponent();
        }
    };
};

},{"./BaseComponent":4,"./GroupContainer":7}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Builder_1 = require("./Builder");
var BaseComponent_1 = require("./component/BaseComponent");
var DomBinder_1 = require("./component/dom/DomBinder");
var listener_1 = require("./event/listener");
var dp;
(function (dp) {
    function compose(component, children) {
        children.forEach(function (child) {
            return component.append(child);
        });
        return component;
    }
    dp.IDENTITY_BINDER = DomBinder_1.DomBinder.IDENTITY_BINDER;
    dp.INT_BINDER = DomBinder_1.DomBinder.INT_BINDER;
    dp.DATA_EVENT = 'DATA_EVENT';
    dp.DATA_EMITTER = function () {
        var eventType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : dp.DATA_EVENT;
        return { eventType: eventType };
    };
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
    function define(definition, properties) {
        var component;

        for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            children[_key - 2] = arguments[_key];
        }

        if (definition === List) {
            component = List(properties, children);
        } else if (typeof definition === 'function') {
            component = compose(definition(properties || {}), children);
        } else if (definition instanceof BaseComponent_1.BaseComponent) {
            component = compose(definition, children);
        } else {
            component = compose(Builder_1.Builder.createComponent(definition, properties || {}, children.some(function (child) {
                return child instanceof BaseComponent_1.BaseComponent;
            })), children);
        }
        return component;
    }
    dp.define = define;
    function listen(stream) {
        return listener_1.Listener.create(stream);
    }
    dp.listen = listen;
})(dp = exports.dp || (exports.dp = {}));

},{"./Builder":3,"./component/BaseComponent":4,"./component/dom/DomBinder":11,"./event/listener":16}],15:[function(require,module,exports){
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
    function ObservationNode(dataNode) {
        var observationProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ObservationNode);

        this.dataNode = dataNode;
        this.observationProperties = observationProperties;
        this.children = new Set();
        this.activeSubscriptions = new Set();
    }

    _createClass(ObservationNode, [{
        key: "append",
        value: function append(child) {
            if (child.parent != null) {
                throw new Error('Observation node cannot be appended since it already has a parent.');
            }
            child.parent = this;
            this.children.add(child);
            this.rebuildDependentSubscriptions();
        }
    }, {
        key: "remove",
        value: function remove(child) {
            if (child.parent === this) {
                this.children.delete(child);
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
        key: "createEmitter",
        value: function createEmitter(emitter) {
            if (emitter) {
                return emitter;
            }
            var contextData = this.dataNode.getMinimalNamedComponent().getData();
            return function () {
                return contextData;
            };
        }
    }, {
        key: "collectSubscriptions",
        value: function collectSubscriptions(subscriber, observedType) {
            var _this4 = this;

            var subscriptions = [];
            var domNode = this.dataNode.component.domNode;

            if (domNode) {
                Object.keys(this.observationProperties).map(function (domEvent) {
                    var _observationPropertie = _this4.observationProperties[domEvent],
                        emitter = _observationPropertie.emitter,
                        eventType = _observationPropertie.eventType;

                    if (observedType == null || observedType === eventType) {
                        var _emitter = _this4.createEmitter(emitter);
                        var handler = function handler(e) {
                            subscriber.next({
                                eventType: eventType,
                                payload: _emitter(e)
                            });
                        };
                        domNode.addEventListener(domEvent, handler);
                        subscriptions.push(function () {
                            return domNode.removeEventListener(domEvent, handler);
                        });
                    }
                });
            }
            var buffer = [];
            this.children.forEach(function (observationNode) {
                return buffer.push(observationNode.collectSubscriptions(subscriber, observedType));
            });
            var array = [].concat.apply(subscriptions, buffer);
            return array;
        }
    }]);

    return ObservationNode;
}();

exports.ObservationNode = ObservationNode;

},{"symbol-observable":1}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
    function applyClass(element, cssClass) {
        if (typeof cssClass === 'string') {
            var classes = cssClass.split(' ');
        } else if (Array.isArray(cssClass)) {
            classes = cssClass;
        } else {
            classes = Object.keys(cssClass).filter(function (className) {
                return cssClass[className];
            });
        }
        classes.forEach(function (className) {
            return element.classList.add(className);
        });
    }
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
    function applyProperty(node, _ref) {
        var name = _ref.name,
            value = _ref.value;

        if (name === const_1.STYLE_PROPERTIES.CLASS) {
            return applyClass(node, value);
        }
        if (name === const_1.STYLE_PROPERTIES.STYLE) {
            return applyStyle(node, value);
        }
        if (name.startsWith('on') && typeof value === 'function') {
            return node.addEventListener(name.substr(2), value);
        }
        var attr = document.createAttribute(name);
        attr.value = value;
        node.attributes.setNamedItem(attr);
    }
    NativeUtil.applyProperty = applyProperty;
    function extractProperty(node, name) {
        if (name === const_1.STYLE_PROPERTIES.CLASS) {
            var classList = node.classList;

            var cssClass = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = classList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var className = _step.value;

                    cssClass.push(className);
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

            return cssClass;
        }
        if (name === const_1.STYLE_PROPERTIES.STYLE) {
            var style = node.style;

            var styleValue = {};
            var propCount = style.length;
            for (var i = 0; i < propCount; i++) {
                var prop = style[i];
                styleValue[toCamelCase(prop)] = style.getPropertyValue(prop);
            }
            return styleValue;
        }
        var attr = node.attributes.getNamedItem(name);
        if (attr != null) {
            return attr.value;
        }
    }
    NativeUtil.extractProperty = extractProperty;
    function applyProperties(node, properties) {
        /* The 'type' is better to set before others */
        if (properties[const_1.NATIVE_PROPERTIES.TYPE]) {
            applyProperty(node, { name: const_1.NATIVE_PROPERTIES.TYPE, value: properties[const_1.NATIVE_PROPERTIES.TYPE] });
        }
        Object.keys(properties).forEach(function (name) {
            if (name === const_1.NATIVE_PROPERTIES.TYPE) {
                return;
            }
            var value = properties[name];
            applyProperty(node, { name: name, value: value });
        });
    }
    NativeUtil.applyProperties = applyProperties;
})(NativeUtil = exports.NativeUtil || (exports.NativeUtil = {}));

},{"./const":19}],18:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var DataNode_1 = require("../component/DataNode");
var DomBinder_1 = require("../component/dom/DomBinder");
var const_1 = require("./const");

var PropertiesReader = function () {
    function PropertiesReader(properties) {
        var _this = this;

        _classCallCheck(this, PropertiesReader);

        this.dataNodeProperties = {};
        this.nativeProperties = {};
        this.observationProperties = {};
        this.bindProperties = {};
        Object.keys(properties).forEach(function (key) {
            if (!_this.checkObservationProperty(key, properties) && !_this.checkBindProperties(key, properties)) {
                _this.registerDataNodeProperty(key, properties);
                _this.registerAsNative(key, properties);
            }
        });
        if (this.dataNodeProperties.name) {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Named;
        } else if (Object.keys(this.bindProperties).some(function (prop) {
            return prop !== DomBinder_1.DEFAULT_BIND;
        })) {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Spread;
        } else {
            this.dataNodeProperties.dataBehavior = DataNode_1.DataMappingBehavior.Search;
        }
    }

    _createClass(PropertiesReader, [{
        key: "registerDataNodeProperty",
        value: function registerDataNodeProperty(key, properties) {
            switch (key.toLowerCase()) {
                case const_1.DATA_NODE_PROPERTIES.NAME:
                    var value = properties[key];
                    if (typeof value !== 'string') {
                        throw new Error('Property "name" must be of type string.');
                    }
                    this.dataNodeProperties[const_1.DATA_NODE_PROPERTIES.NAME] = value;
                    break;
            }
        }
    }, {
        key: "checkObservationProperty",
        value: function checkObservationProperty(key, properties) {
            var prop = key.toLowerCase();
            var propValue = properties[key];
            if (prop.startsWith('on') && (typeof propValue === "undefined" ? "undefined" : _typeof(propValue)) === 'object') {
                this.observationProperties[prop.substr(2)] = Object.assign({}, propValue);
                return true;
            }
        }
    }, {
        key: "checkBindProperties",
        value: function checkBindProperties(key, properties) {
            var prop = key.toLowerCase();
            var propValue = properties[key];
            switch (prop) {
                case const_1.BIND_PROPERTIES.BIND:
                    this.bindProperties[DomBinder_1.DEFAULT_BIND] = Object.assign({}, propValue);
                    return true;
            }
            if ((typeof propValue === "undefined" ? "undefined" : _typeof(propValue)) === 'object' || propValue.get || propValue.set) {
                if (prop === const_1.DATA_NODE_PROPERTIES.NAME) {
                    throw new Error('Property "name" must be of type string.');
                }
                this.bindProperties[prop] = Object.assign({}, propValue);
                return true;
            }
            if (typeof propValue === 'function') {
                if (prop === const_1.DATA_NODE_PROPERTIES.NAME) {
                    throw new Error('Property "name" must be of type string.');
                }
                this.bindProperties[prop] = { set: propValue };
                return true;
            }
        }
    }, {
        key: "registerAsNative",
        value: function registerAsNative(key, properties) {
            var prop = key.toLowerCase();
            switch (prop) {
                case const_1.NATIVE_PROPERTIES.TYPE:
                    this.nativeProperties[const_1.NATIVE_PROPERTIES.TYPE] = properties[key].toLowerCase();
                    break;
                default:
                    this.nativeProperties[prop] = properties[key];
                    break;
            }
        }
    }], [{
        key: "create",
        value: function create(properties) {
            return new PropertiesReader(properties);
        }
    }]);

    return PropertiesReader;
}();

exports.PropertiesReader = PropertiesReader;

},{"../component/DataNode":6,"../component/dom/DomBinder":11,"./const":19}],19:[function(require,module,exports){
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
    NAME: 'name'
};
exports.STYLE_PROPERTIES = {
    CLASS: 'class',
    STYLE: 'style'
};
exports.NATIVE_PROPERTIES = {
    TYPE: 'type',
    ID: 'id'
};
exports.BIND_PROPERTIES = {
    BIND: 'bind'
};

},{}]},{},[14])(14)
});
