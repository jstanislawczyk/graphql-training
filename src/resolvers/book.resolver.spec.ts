import {expect, use} from 'chai';
import sinon, {SinonStubbedInstance} from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {SinonSandbox} from 'sinon';
import {Book} from '../models/book';
import {book, fullBook} from '../../test/fixtures/book.fixture';
import {BookResolver} from './book.resolver';
import {BookService} from '../services/book.service';

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
      const books: Book[] = await bookResolver.books();

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
      const books: Book[] = await bookResolver.books();

      // Assert
      expect(books).to.have.length(2);
      expect(books[0]).to.be.eql(book);
      expect(books[1]).to.be.eql(fullBook);
    });

    it('should throw error from service', async () => {
      // Arrange
      bookService.findAll.rejects(new Error('FindAll error'));

      // Act
      const booksResponse: Promise<Book[]> = bookResolver.books();

      // Assert
      await expect(booksResponse).to.eventually.be.rejectedWith('FindAll error');
    });
  });
});
