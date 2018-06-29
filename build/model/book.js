'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _author = require('./author');

var _author2 = _interopRequireDefault(_author);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookSchema = _mongoose2.default.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'author',
    required: true
  },
  description: {
    type: String,
    minlength: 10
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook'],
    default: 'hardcover'
  }
}, { timestamps: true });

bookSchema.pre('findOne', function preQueryHook(done) {
  this.populate('author');
  done();
});

bookSchema.post('remove', function (book, done) {
  _author2.default.findById(book.author._id).then(function (author) {
    author.authored = author.authored.filter(function (bId) {
      return bId !== book._id.toString();
    });
    return author.save();
  }).then(done()).catch(function (err) {
    throw err;
  });
});

bookSchema.post('save', function (book) {
  _author2.default.findById(book.author).then(function (author) {
    author.authored.push(book._id);
    return author.save();
  }).catch(function (err) {
    throw err;
  });
});

var skipInit = process.env.NODE_ENV === 'development';
exports.default = _mongoose2.default.model('book', bookSchema, 'books', skipInit);