import {BookService} from './book.service';
import {BookRepository} from '../repositories/book.repository';
import {expect, use} from 'chai';
import sinon, {SinonStubbedInstance} from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {SinonSandbox} from 'sinon';
import {Book} from '../models/book';
import {book, fullBook} from '../../test/fixtures/book.fixture';

use(sinonChai);
use(chaiAsPromised);

describe('BookService', () => {

  let sandbox: SinonSandbox;
  let bookService: BookService;
  let bookRepository: SinonStubbedInstance<BookRepository>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    bookRepository = sandbox.createStubInstance(BookRepository);
    bookService = new BookService(bookRepository as unknown as BookRepository);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {

    it('should return empty list', async () => {
      // Arrange
      bookRepository.find.resolves([]);

      // Act
      const books: Book[] = await bookService.findAll();

      // Assert
      expect(books).to.be.empty;
      expect(bookRepository.find).to.be.calledOnce;
    });

    it('should return books list', async () => {
      // Arrange
      bookRepository.find.resolves([
        book, fullBook,
      ]);

      // Act
      const books: Book[] = await bookService.findAll();

      // Assert
      expect(books).to.have.length(2);
      expect(books[0]).to.be.eql(book);
      expect(books[1]).to.be.eql(fullBook);
    });

    it('should throw error from repository', async () => {
      // Arrange
      bookRepository.find.rejects(new Error('Find error'));

      // Act
      const booksResponse: Promise<Book[]> = bookService.findAll();

      // Assert
      await expect(booksResponse).to.eventually.be.rejectedWith('Find error');
    });
  });
});
