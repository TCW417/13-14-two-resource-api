'use strict';

import mongoose from 'mongoose';
import Author from './author';

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'author',
    required: true,
  },
  description: {
    type: String,
    minlength: 10,
  },
  format: {
    type: String,
    enum: ['hardcover', 'paperback', 'ebook'],
    default: 'hardcover',
  },
}, { timestamps: true });

// bookSchema.pre('findOne', function preQueryHook(done) {
//   // this.populate('author');
//   done();
// });

bookSchema.post('remove', (book, done) => {
  Author.findById(book.author._id)
    .then((author) => {
      author.authored = author.authored.filter(bId => bId.toString() !== book._id.toString());
      return author.save();
    })
    .then(done())
    .catch((err) => {
      throw err;
    });
});

bookSchema.post('save', (book) => {
  Author.findById(book.author)
    .then((author) => {
      author.authored.push(book._id);
      return author.save();
    })
    .catch((err) => {
      throw err;
    });
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('book', bookSchema, 'books', skipInit);
