'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _author = require('../model/author');

var _author2 = _interopRequireDefault(_author);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authorRouter = new _express.Router();

authorRouter.post('/api/read/author', function (request, response, next) {
  _author2.default.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'AUTHOR ROUTER BEFORE SAVE: Saved a new author ' + JSON.stringify(request.body));
    return new _author2.default(request.body).save();
  }).then(function (newAuthor) {
    _logger2.default.log(_logger2.default.INFO, 'AUTHOR ROUTER AFTER SAVE: Saved a new author ' + JSON.stringify(newAuthor));
    return response.status(201).json(newAuthor);
  }).catch(next);
});

authorRouter.get('/api/read/author/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }
  _author2.default.init().then(function () {
    return _author2.default.findOne({ _id: request.params.id });
  }).then(function (foundAuthor) {
    _logger2.default.log(_logger2.default.INFO, 'AUTHOR ROUTER: FOUND THE MODEL, ' + JSON.stringify(foundAuthor));
    return response.status(200).json(foundAuthor);
  }).catch(next);
  return undefined;
});

authorRouter.put('/api/read/author/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }

  _author2.default.init().then(function () {
    return _author2.default.findOneAndUpdate({ _id: request.body._id }, request.body);
  }).then(function (foundAuthor) {
    _logger2.default.log(_logger2.default.INFO, 'AUTHOR ROUTER: AFTER UPDATING ' + JSON.stringify(foundAuthor));
    return response.status(200).json(foundAuthor);
  }).catch(next);
  return undefined;
});

authorRouter.delete('/api/read/author/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'Did not enter and ID'));
  }

  _author2.default.init().then(function () {
    return _author2.default.findById(request.params.id);
  }).then(function (author) {
    if (!author) {
      // findBy return null --> author not found 
      next(new _httpErrors2.default(404, 'Attempt to delete non-existant author'));
    }
    return author.remove();
  }).then(function () {
    return response.sendStatus(200);
  }).catch(next);
  return undefined;
});

exports.default = authorRouter;