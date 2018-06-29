'use strict';

import mongoose from 'mongoose';
import Books from './book';

const authorSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  authored: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book',
  }],
}, { timestamps: true });

// authorSchema.pre('findOne', function preQueryHook(done) {
  // this.populate('authored');
  // done();
// });

authorSchema.post('remove', (author) => {
  for (let i = 0; i < author.authored.length; i++) {
    Books.findById(author.authored[i])
      .then((book) => {
        book.remove()
          .catch((err) => {
            throw err;
          });
      });
  }
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('author', authorSchema, 'authors', skipInit);
