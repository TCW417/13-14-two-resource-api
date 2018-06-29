'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _author = require('../../model/author');

var _author2 = _interopRequireDefault(_author);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var mockResouceToPost = {
    firstName: _faker2.default.name.firstName(),
    lastName: _faker2.default.name.lastName()
  };
  return new _author2.default(mockResouceToPost).save();
};