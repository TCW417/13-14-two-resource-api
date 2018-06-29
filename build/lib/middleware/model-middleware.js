'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _model = require('../../model/');

var _model2 = _interopRequireDefault(_model);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, response, next) {
  _logger2.default.log(_logger2.default.INFO, 'HITTING MODEL MIDDLEWARE');
  // /api/:model
  return (0, _model2.default)().then(function (modelMap) {
    var modelParamsExists = request.params && request.params.model;
    var model = modelParamsExists ? request.params.model : '';
    if (modelMap[model]) {
      request.model = modelMap[model].default;
      _logger2.default.log(_logger2.default.INFO, 'MODEL MIDDLEWARE: Succesfully attached model to request');
      return next();
    }
    _logger2.default.log(_logger2.default.ERROR, 'MODEL MIDDLEWARE: Made a bad request for a model that doesn\'t exist');
    return next(new _httpErrors2.default(400, 'You did not enter a proper Mongoose model'));
  }).catch(next);
};