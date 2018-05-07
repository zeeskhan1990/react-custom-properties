(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'prop-types'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('prop-types'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes);
    global.customProperties = mod.exports;
  }
})(this, function (exports, _react, _propTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var CustomProperties = function (_Component) {
    _inherits(CustomProperties, _Component);

    function CustomProperties(props) {
      _classCallCheck(this, CustomProperties);

      var _this = _possibleConstructorReturn(this, (CustomProperties.__proto__ || Object.getPrototypeOf(CustomProperties)).call(this, props));

      _this.styleElement = null;
      _this.customClass = '';


      _this.container = null;
      _this.handleNewProperties = _this.handleNewProperties.bind(_this);

      if (!document.querySelector("style#react-css-custom-styles")) {
        // Create the <style> tag
        var styleElement = document.createElement("style");
        styleElement.setAttribute("id", "react-css-custom-styles");

        // WebKit hack
        styleElement.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(styleElement);

        _this.styleElement = styleElement;

        window.onbeforeunload = function () {
          return sessionStorage.removeItem("customClassSequence");
        };
      } else {
        _this.styleElement = document.querySelector("style#react-css-custom-styles");
      }

      var customClassSequence = sessionStorage.getItem("customClassSequence");
      if (!customClassSequence) {
        customClassSequence = 0;
        sessionStorage.setItem("customClassSequence", customClassSequence);
      } else {
        customClassSequence = customClassSequence + 1;
        sessionStorage.setItem("customClassSequence", customClassSequence);
      }
      _this.customClass = 'react-css-custom-' + customClassSequence;

      return _this;
    }

    _createClass(CustomProperties, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var properties = this.props.properties;

        var keys = Object.keys(properties);
        this.insertStyles(properties);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var properties = this.props.properties;


        if (nextProps.properties !== properties) {
          this.handleNewProperties(nextProps.properties, properties);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _props = this.props,
            global = _props.global,
            properties = _props.properties;


        if (!global) {
          return;
        }
        this.removeStyles();
      }
    }, {
      key: 'handleNewProperties',
      value: function handleNewProperties(next, previous) {
        this.removeStyles();
        this.insertStyles(next);
      }
    }, {
      key: 'insertStyles',
      value: function insertStyles(properties) {
        var customStringify = function customStringify(obj_from_json) {
          if ((typeof obj_from_json === 'undefined' ? 'undefined' : _typeof(obj_from_json)) !== "object" || Array.isArray(obj_from_json)) {
            // not an object, stringify using native function
            return JSON.stringify(obj_from_json);
          }
          // Implements recursive object serialization according to JSON spec
          // but without quotes around the keys.
          var props = Object.keys(obj_from_json).map(function (key) {
            return key + ':' + customStringify(obj_from_json[key]);
          }).join(";");
          return '{' + props + '}';
        };

        var ruleSet = customStringify(properties);
        debugger;
        var styleSpecifier = this.props.global ? ':root' : '.' + this.customClass;
        this.styleElement.sheet.insertRule(styleSpecifier + ' ' + ruleSet, 0);
      }
    }, {
      key: 'removeStyles',
      value: function removeStyles() {
        var currentStyleSheet = this.styleElement.sheet;
        var styleSpecifier = this.props.global ? ':root' : '.' + this.customClass;
        for (var i = 0; i < currentStyleSheet.cssRules.length; i++) {
          if (currentStyleSheet.cssRules[i].selectorText === styleSpecifier) currentStyleSheet.deleteRule(i);
          break;
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return !this.props.global ? _react2.default.createElement(
          'div',
          { className: this.customClass },
          this.props.children
        ) : this.props.children || null;
      }
    }]);

    return CustomProperties;
  }(_react.Component);

  CustomProperties.propTypes = {
    global: _propTypes2.default.bool,
    properties: _propTypes2.default.objectOf(function (value, key, componentName) {
      var pattern = /^--\S+$/;
      if (!pattern.test(key)) {
        return new Error(('\n<' + componentName + ' /> could not set the property "' + key + ': ' + value[key] + ';".\nCustom Property names must be a string starting with two dashes, for example "--theme-background".\n      ').trim());
      }
    })
  };

  CustomProperties.defaultProps = {
    global: false,
    properties: {}
  };

  exports.default = CustomProperties;
});