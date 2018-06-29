'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _author = require('../model/author');

var _author2 = _interopRequireDefault(_author);

var _book = require('../model/book');

var _book2 = _interopRequireDefault(_book);

var _bookMock = require('./lib/bookMock');

var _bookMock2 = _interopRequireDefault(_bookMock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api/read/book';

beforeAll(_server.startServer);
afterAll(_server.stopServer);

describe('POST /api/read/book', function () {
  beforeEach(function () {
    Promise.all([_book2.default.remove(), _author2.default.remove()]);
  });

  test('409 POST for trying to create a book with duplicate title', function () {
    return (0, _bookMock2.default)().then(function (mockData) {
      expect.assertions(1);
      var mockBook = {
        title: mockData.book.title,
        description: _faker2.default.lorem.words(15),
        author: mockData.author._id
      };
      return _superagent2.default.post(apiUrl).send(mockBook);
    }).then(function (response) {
      throw response; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(409);
    });
  });
});