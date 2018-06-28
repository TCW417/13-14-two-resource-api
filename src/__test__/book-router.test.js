'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Author from '../model/author';
import Book from '../model/book';
import createMockDataPromise from './lib/bookMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/read/book`;

beforeAll(startServer);
afterAll(stopServer);

describe('POST /api/read/book', () => {
  beforeEach(() => {
    Promise.all([
      Book.remove(),
      Author.remove(),
    ]);
  });

  test('201 POST for succcesful posting of a book', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockBook = {
          title: faker.lorem.words(3),
          description: faker.lorem.words(15),
          author: mockData.author._id,
        };

        return superagent.post(apiUrl)
          .send(mockBook)
          .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.body.title).toEqual(mockBook.title);
            expect(response.body.description).toEqual(mockBook.description);
            expect(response.body._id).toBeTruthy();
          })
          .catch((err) => {
            throw err;
          });
      });
  });
});

describe('GET /api/read/book/:id', () => {
  beforeEach(() => {
    Promise.all([
      Book.remove(),
      Author.remove(),
    ]);
  });

  test('200 GET for succesful fetching of a book', () => {
    let newBook;
    return createMockDataPromise()
      .then((mockData) => {
        newBook = mockData;
        return superagent.get(`${apiUrl}/${mockData.book._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.title).toEqual(newBook.title);
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('PUT /api/read/book/:id', () => {
  beforeEach(() => {
    Promise.all([
      Book.remove(),
      Author.remove(),
    ]);
  });

  test('200 PUT for succesful updating of existing book', () => {
    let newBook;
    return createMockDataPromise()
      .then((mockData) => {
        newBook = mockData.book;
        newBook.title = 'This title has been updated';
        return superagent.put(`${apiUrl}/${newBook._id}`)
          .send(newBook);
      })
      .then((result) => {
        expect(result.status).toEqual(200);
        return Book.findById(newBook._id);
      })
      .then((result) => {
        expect(result.title).toEqual(newBook.title);
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('DELETE /api/read/book/:id', () => {
  let newBook;

  test('200 (?) DELETE for succesfully deleting a book', () => {
    return createMockDataPromise()
      .then((mockData) => {
        newBook = mockData.book;
        return superagent.delete(`${apiUrl}/${newBook._id}`);
      })
      .then((result) => {
        expect(result.status).toEqual(200);
      });
  });

  test('404 DELETE for try to delete nonexistant book', () => {
    return superagent.delete(`${apiUrl}/${newBook._id}`)
      .then((result) => {
        throw result; // shouldn't get here
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
