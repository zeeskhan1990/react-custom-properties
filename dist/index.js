(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './components/custom-properties'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./components/custom-properties'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.customProperties);
    global.index = mod.exports;
  }
})(this, function (exports, _customProperties) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _customProperties2 = _interopRequireDefault(_customProperties);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _customProperties2.default;
});