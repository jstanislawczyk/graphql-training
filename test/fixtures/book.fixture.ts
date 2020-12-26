import {Book} from '../../src/models/book';

export const book: Book = {
  isPublished: true,
};

export const fullBook: Book = {
  ...book,
  author: 'John',
  title: 'BookTitle',
};
