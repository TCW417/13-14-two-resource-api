'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _book = require('./book');

var _book2 = _interopRequireDefault(_book);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authorSchema = _mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  authored: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'book'
  }]
}, { timestamps: true });

authorSchema.pre('findOne', function preQueryHook(done) {
  this.populate('authored');
  done();
});

authorSchema.post('remove', function (author) {
  for (var i = 0; i < author.authored.length; i++) {
    _book2.default.findById(author.authored[i]).then(function (book) {
      book.remove().catch(function (err) {
        throw err;
      });
    });
  }
});

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('author', authorSchema, 'authors', skipInit);