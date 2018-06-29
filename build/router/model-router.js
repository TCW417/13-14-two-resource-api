'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _modelMiddleware = require('../lib/middleware/model-middleware');

var _modelMiddleware2 = _interopRequireDefault(_modelMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelRouter = new _express.Router();

modelRouter.param('model', _modelMiddleware2.default);

modelRouter.post('/api/read/:model', function (request, response, next) {
  var Model = request.model;
  Model.init().then(function () {
    _logger2.default.log(_logger2.default.INFO, 'MODEL-ROUTER, BEFORE SAVING A NEW ' + request.params.model + ': ' + JSON.stringify(request.body));
    return new Model(request.body).save();
  }).then(function (newResource) {
    _logger2.default.log(_logger2.default.INFO, 'MODEL-ROUTER AFTER SAVING A NEW ' + request.params.model + ': ' + JSON.stringify(newResource));
    return response.status(201).json(newResource);
  }).catch(next);
});

modelRouter.get('/api/read/:model/:id?', function (request, response, next) {
  if (!request.params.id) {
    // return next(new HttpErrors(400, `No ${request.model} id entered`));
    var _Model = request.model;
    _Model.init().then(function () {
      return _Model.find();
    }).then(function (foundModel) {
      _logger2.default.log(_logger2.default.INFO, 'MODEL-ROUTER: FOUND THE MODEL ' + JSON.stringify(foundModel));
      return response.status(200).json(foundModel);
    }).catch(next);
  }
  var Model = request.model;
  Model.init().then(function () {
    return Model.findOne({ _id: request.params.id });
  }).then(function (foundModel) {
    _logger2.default.log(_logger2.default.INFO, 'MODEL-ROUTER: FOUND THE MODEL ' + JSON.stringify(foundModel));
    return response.status(200).json(foundModel);
  }).catch(next);
  return undefined;
});

modelRouter.put('/api/read/:model/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'No ' + request.model + ' id entered'));
  }
  var Model = request.model;
  Model.init().then(function () {
    return Model.findOneAndUpdate({ _id: request.body._id }, request.body);
  }).then(function (foundModel) {
    _logger2.default.log(_logger2.default.INFO, 'MODEL-ROUTER: FOUND THE MODEL ' + JSON.stringify(foundModel));
    return response.json(foundModel);
  }).catch(next);
  return undefined;
});

modelRouter.delete('/api/read/:model/:id?', function (request, response, next) {
  if (!request.params.id) {
    return next(new _httpErrors2.default(400, 'No ' + request.model + ' id entered'));
  }
  var Model = request.model;
  Model.init().then(function () {
    return Model.findById(request.params.id);
  }).then(function (resource) {
    if (!resource) {
      // findBy return null --> book not found 
      return next(new _httpErrors2.default(404, 'Attempt to delete non-existant ' + request.model));
    }
    return resource.remove();
  }).then(function () {
    return response.sendStatus(200);
  }).catch(next);
  return undefined;
});

exports.default = modelRouter;