'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _book = require('../../model/book');

var _book2 = _interopRequireDefault(_book);

var _authorMock = require('./authorMock');

var _authorMock2 = _interopRequireDefault(_authorMock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var mockData = {};
  return (0, _authorMock2.default)().then(function (newAuthor) {
    mockData.author = newAuthor;
  }).then(function () {
    var mockBook = {
      title: _faker2.default.lorem.words(3),
      description: _faker2.default.lorem.words(20),
      format: 'paperback',
      author: mockData.author._id
    };
    return new _book2.default(mockBook).save();
  }).then(function (newBook) {
    mockData.book = newBook;
    return mockData;
  }).catch(function (err) {
    throw err;
  });
};