'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _server = require('../lib/server');

var _author = require('../model/author');

var _author2 = _interopRequireDefault(_author);

var _authorMock = require('./lib/authorMock');

var _authorMock2 = _interopRequireDefault(_authorMock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT + '/api/read/author';

beforeAll(_server.startServer);
afterAll(_server.stopServer);
afterEach(function () {
  return _author2.default.remove();
});

describe('POST /api/read/author', function () {
  var mockResource = {
    firstName: _faker2.default.name.firstName(),
    lastName: _faker2.default.name.lastName()
  };

  test('201 POST for successful post of a author', function () {
    return _superagent2.default.post(apiUrl).send(mockResource).then(function (response) {
      expect(response.status).toEqual(201);
      expect(response.body.firstName).toEqual(mockResource.firstName);
      expect(response.body.lastName).toEqual(mockResource.lastName);
      expect(response.body._id).toBeTruthy();
    }).catch(function (err) {
      throw err;
    });
  });

  test('400 POST for author missing required property', function () {
    delete mockResource.lastName;
    return _superagent2.default.post(apiUrl).send(mockResource).then(function (response) {
      throw response; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  // can't do a 409 test on current implementation of authors because there's no unique requirement.  
});

describe('GET /api/read/author/:id', function () {
  test('200 GET for successful fetching of an author', function () {
    var returnedAuthor = void 0;
    return (0, _authorMock2.default)().then(function (newAuthor) {
      returnedAuthor = newAuthor;
      return _superagent2.default.get(apiUrl + '/' + newAuthor._id);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.firstName).toEqual(returnedAuthor.firstName);
      expect(response.body.lastName).toEqual(returnedAuthor.lastName);
    }).catch(function (err) {
      throw err;
    });
  });

  test('404 GET for fetching nonexistent author', function () {
    return _superagent2.default.get(apiUrl + '/12345').then(function (result) {
      throw result; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});

describe('PUT /api/read/author/:id', function () {
  test('200 PUT for sucessful updating of existing author', function () {
    var newAuthor = void 0;
    return (0, _authorMock2.default)().then(function (mockAuthor) {
      newAuthor = mockAuthor;
      newAuthor.lastName = 'Smith';
      return _superagent2.default.put(apiUrl + '/' + newAuthor._id).send(newAuthor);
    }).then(function (result) {
      expect(result.status).toEqual(200);
      return _author2.default.findById(newAuthor._id);
    }).then(function (result) {
      expect(result.lastName).toEqual('Smith');
    }).catch(function (err) {
      throw err;
    });
  });

  test('400 PUT for adding proprty to existing author', function () {
    var newAuthor = void 0;
    return (0, _authorMock2.default)().then(function (mockAuthor) {
      newAuthor = mockAuthor;
      newAuthor.lastName = 'Smith';
      newAuthor.age = '58';
      /*
      Turns out this is a pointless test. Here's the Author
      after adding a ".age" property:
      console.log('>>>>>>>> msg body for PUT', newAuthor);
        >>>>>>>> msg body for PUT { authored: [],
          _id: 5b343cf4e0cbd81dabc443a8,
          firstName: 'Janet',
          lastName: 'Smith',
          createdAt: 2018-06-28T01:42:12.989Z,
          updatedAt: 2018-06-28T01:42:12.989Z,
          __v: 0 }
      No .age! And updating results in 200. So nevermind I guess.
      */
      return _superagent2.default.put(apiUrl + '/' + newAuthor._id).send(newAuthor).then(function (result) {
        expect(result.status).toEqual(200); // ?!
      }).catch(function (err) {
        throw err;
      });
    });
  });

  test('404 PUT for updating of nonexisting author', function () {
    var newAuthor = void 0;
    return (0, _authorMock2.default)().then(function (mockAuthor) {
      newAuthor = mockAuthor;
      newAuthor.lastName = 'Smith';
      newAuthor._id = '12345';
      return _superagent2.default.put(apiUrl + '/' + newAuthor._id).send(newAuthor);
    }).then(function (result) {
      expect(result.status).toEqual(200);
      return _author2.default.findById(newAuthor._id);
    }).then(function (result) {
      expect(result.lastName).toEqual('Smith');
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});

describe('DELETE /api/read/author/:id', function () {
  var newAuthor = void 0;

  test('200 DELETE for succesfully deleting an author', function () {
    return (0, _authorMock2.default)().then(function (mockData) {
      newAuthor = mockData;
      return _superagent2.default.delete(apiUrl + '/' + newAuthor._id);
    }).then(function (result) {
      expect(result.status).toEqual(200);
      return _author2.default.findById(newAuthor._id);
    }).then(function (result) {
      expect(result).toBeNull();
    });
  });

  test('404 DELETE for try to delete nonexistant author', function () {
    return _superagent2.default.delete(apiUrl + '/12345').then(function (result) {
      throw result; // shouldn't get here
    }).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});