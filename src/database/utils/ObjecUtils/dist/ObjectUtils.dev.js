"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

Object.prototype.removeBlankProperties = function () {
  for (var propName in this) {
    if (!this[propName]) {
      delete this[propName];
    }
  }
};

var _default = _lodash["default"];
exports["default"] = _default;