import {expect, use} from 'chai';
import sinon, {SinonStubbedInstance} from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {SinonSandbox} from 'sinon';
import {Book} from '../models/book';
import {book, fullBook} from '../../test/fixtures/book.fixture';
import {BookResolver} from './book.resolver';
import {BookService} from '../services/book.service';
import {DeleteResult} from 'typeorm';
import {CreateBookInput} from '../inputs/book.input';
import {UpdateBookInput} from '../inputs/update-book.input';

use(sinonChai);
use(chaiAsPromised);

describe('BookResolver', () => {

  let sandbox: SinonSandbox;
  let bookResolver: BookResolver;
  let bookService: SinonStubbedInstance<BookService>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    bookService = sandbox.createStubInstance(BookService);
    bookResolver = new BookResolver(bookService as unknown as BookService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    it('should return empty list', async () => {
      // Arrange
      bookService.findAll.resolves([]);

      // Act
      const books: Book[] = await bookResolver.getBooks();

      // Assert
      expect(books).to.be.empty;
      expect(bookService.findAll).to.be.calledOnce;
    });

    it('should return books list', async () => {
      // Arrange
      bookService.findAll.resolves([
        book, fullBook,
      ]);

      // Act
      const books: Book[] = await bookResolver.getBooks();

      // Assert
      expect(books).to.have.length(2);
      expect(books[0]).to.be.eql(book);
      expect(books[1]).to.be.eql(fullBook);
    });

    it('should throw error from service', async () => {
      // Arrange
      bookService.findAll.rejects(new Error('FindAll error'));

      // Act
      const booksResponse: Promise<Book[]> = bookResolver.getBooks();

      // Assert
      await expect(booksResponse).to.eventually.be.rejectedWith('FindAll error');
    });
  });

  describe('getBookById', () => {
    it('should return book', async () => {
      // Arrange
      bookService.findOne.resolves(fullBook);

      // Act
      const book: Book = await bookResolver.getBookById(1);

      // Assert
      expect(book).to.be.eql(fullBook);
    });

    it('should throw error from service', async () => {
      // Arrange
      bookService.findOne.rejects(new Error('FindOne error'));

      // Act
      const bookResponse: Promise<Book> = bookResolver.getBookById(1);

      // Assert
      await expect(bookResponse).to.eventually.be.rejectedWith('FindOne error');
    });
  });

  describe('saveBook', () => {
    it('should save book', async () => {
      // Arrange
      const createBookInput: CreateBookInput = {
        author: 'NewAuthor',
        title: 'NewTitle',
        isPublished: false,
      };
      const savedBook: Book = {
        ...createBookInput,
        id: 1,
      };
      bookService.save.resolves(savedBook);

      // Act
      const book: Book = await bookResolver.saveBook(createBookInput);

      // Assert
      expect(book).to.be.eql(savedBook);
    });

    it('should throw error from service', async () => {
      // Arrange
      const createBookInput: CreateBookInput = {
        author: 'NewAuthor',
        title: 'NewTitle',
        isPublished: false,
      };

      bookService.save.rejects(new Error('Save error'));

      // Act
      const bookResponse: Promise<Book> = bookResolver.saveBook(createBookInput);

      // Assert
      await expect(bookResponse).to.eventually.be.rejectedWith('Save error');
    });
  });

  describe('updateBook', () => {
    it('should update book', async () => {
      // Arrange
      const updateBookInput: UpdateBookInput = {
        author: 'NewAuthor',
        title: 'NewTitle',
        isPublished: false,
      };
      const updatedBook: Book = {
        id: 1,
        author: 'NewAuthor',
        title: 'NewTitle',
        isPublished: false,
      };

      bookService.update.resolves(updatedBook);

      // Act
      const book: Book = await bookResolver.updateBook(1, updateBookInput);

      // Assert
      expect(book).to.be.eql(updatedBook);
    });

    it('should throw error from service', async () => {
      // Arrange
      const updateBookInput: UpdateBookInput = {
        author: 'NewAuthor',
        title: 'NewTitle',
        isPublished: false,
      };

      bookService.update.rejects(new Error('Update error'));

      // Act
      const bookResponse: Promise<Book> = bookResolver.updateBook(1, updateBookInput);

      // Assert
      await expect(bookResponse).to.eventually.be.rejectedWith('Update error');
    });
  });

  describe('deleteBookById', () => {
    it('should delete book', async () => {
      // Arrange
      const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
      };

      bookService.deleteById.resolves(deleteResult);

      // Act
      const deleted: boolean = await bookResolver.deleteBookById(1);

      // Assert
      expect(deleted).to.be.eql(true);
    });

    it('should throw error from service', async () => {
      // Arrange
      bookService.deleteById.rejects(new Error('DeleteById error'));

      // Act
      const deleted: Promise<boolean> = bookResolver.deleteBookById(1);

      // Assert
      await expect(deleted).to.eventually.be.rejectedWith('DeleteById error');
    });
  });
});
