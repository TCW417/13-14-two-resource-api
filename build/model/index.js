'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildModelRouterP = _util2.default.promisify(_fs2.default.readdir);
var modelPath = '' + __dirname;

console.log(modelPath);

exports.default = function () {
  return buildModelRouterP(modelPath).then(function (models) {
    var newModels = models.filter(function (model) {
      return model !== 'index.js';
    }).map(function (model) {
      return './' + model;
    });
    var modelMap = newModels.reduce(function (storage, currentModel) {
      var model = require(currentModel); /*eslint-disable-line*/
      var isMongooseModel = model.default && model.default.modelName;
      var modelName = isMongooseModel ? model.default.modelName : currentModel;
      storage[modelName] = model;
      return storage;
    }, {});
    return modelMap;
  }).catch(function (err) {
    throw err;
  });
};