'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _book = require('../model/book');

var _book2 = _interopRequireDefault(_book);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookRouter = new _express.Router();

bookRouter.post('/api/read/book', function (request, response, next) {
  _book2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'BOOK ROUTER: POST BEFORE SAVE: ' + JSON.stringify(request.body));
    return new _book2.default(request.body).save();
  }).then(function (newBook) {
    _logger2.default.log(_logger2.default.INFO, 'BOOK ROUTER: POST AFTER SAVE: ' + JSON.stringify(newBook));
    response.status(201).json(newBook);
  }).catch(next);
});

bookRouter.get('/api/read/book/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }

  _book2.default.init().then(function () {
    return _book2.default.findOne({ _id: request.params.id });
  }).then(function (foundBook) {
    _logger2.default.log(_logger2.default.INFO, 'BOOK ROUTER: AFTER GETTING BOOK ' + JSON.stringify(foundBook));
    return response.status(200).json(foundBook);
  }).catch(next);
  return undefined;
});

bookRouter.put('/api/read/book/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }

  _book2.default.init().then(function () {
    return _book2.default.findOneAndUpdate({ _id: request.body._id }, request.body);
  }).then(function (foundBook) {
    _logger2.default.log(_logger2.default.INFO, 'BOOK ROUTER: AFTER UPDATING BOOK ' + JSON.stringify(foundBook));
    return response.json(foundBook);
  }).catch(next);
  return undefined;
});

bookRouter.delete('/api/read/book/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }

  _book2.default.init().then(function () {
    return _book2.default.findById(request.params.id);
  }).then(function (book) {
    if (!book) {
      // findBy return null --> book not found 
      return next(new _httpErrors2.default(404, 'Attempt to delete non-existant book'));
    }
    return book.remove();
  }).then(function () {
    return response.sendStatus(200);
  }).catch(next);
  return undefined;
});
exports.default = bookRouter;