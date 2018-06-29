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

  test('201 POST for succcesful posting of a book', function () {
    var mockBook = void 0;
    return (0, _bookMock2.default)().then(function (mockData) {
      expect.assertions(5);
      mockBook = {
        title: _faker2.default.lorem.words(3),
        description: _faker2.default.lorem.words(15),
        author: mockData.author._id
      };
      return _superagent2.default.post(apiUrl).send(mockBook);
    }).then(function (response) {
      expect(response.status).toEqual(201);
      expect(response.body.title).toEqual(mockBook.title);
      expect(response.body.description).toEqual(mockBook.description);
      expect(response.body._id).toBeTruthy();
      expect(response.body.author.toString()).toEqual(mockBook.author.toString());
    }).catch(function (err) {
      throw err;
    });
  });
});

describe('GET /api/read/book/:id', function () {
  test('200 GET for succesful fetching of a book', function () {
    var newBook = void 0;
    return (0, _bookMock2.default)().then(function (mockData) {
      newBook = mockData;
      return _superagent2.default.get(apiUrl + '/' + mockData.book._id);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.title).toEqual(newBook.title);
    }).catch(function (err) {
      throw err;
    });
  });

  test('404 GET of non-existent book', function () {
    return _superagent2.default.get(apiUrl + '/12345').then(function (result) {
      throw result; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});

describe('PUT /api/read/book/:id', function () {
  test('200 PUT for succesful updating of existing book', function () {
    var newBook = void 0;
    return (0, _bookMock2.default)().then(function (mockData) {
      newBook = mockData.book;
      newBook.title = 'This title has been updated';
      return _superagent2.default.put(apiUrl + '/' + newBook._id).send(newBook);
    }).then(function (result) {
      expect(result.status).toEqual(200);
      return _book2.default.findById(newBook._id);
    }).then(function (result) {
      expect(result.title).toEqual(newBook.title);
    }).catch(function (err) {
      throw err;
    });
  });
});

describe('DELETE /api/read/book/:id', function () {
  var newBook = void 0;

  test('200 DELETE for succesfully deleting a book', function () {
    return (0, _bookMock2.default)().then(function (mockData) {
      newBook = mockData.book;
      return _superagent2.default.delete(apiUrl + '/' + newBook._id);
    }).then(function (result) {
      expect(result.status).toEqual(200);
      return _book2.default.findById(newBook._id);
    }).then(function (result) {
      expect(result).toBeNull();
    });
  });

  test('404 DELETE for try to delete nonexistant book', function () {
    return _superagent2.default.delete(apiUrl + '/12345').then(function (result) {
      throw result; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});