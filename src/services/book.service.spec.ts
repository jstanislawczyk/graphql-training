import {BookService} from './book.service';
import {BookRepository} from '../repositories/book.repository';
import {expect, use} from 'chai';
import sinon, {SinonStubbedInstance} from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {SinonSandbox} from 'sinon';
import {Book} from '../models/book';
import {book, fullBook} from '../../test/fixtures/book.fixture';
import {DeleteResult} from 'typeorm';
import {UpdateBookInput} from '../inputs/update-book.input';

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

  describe('findOne', () => {
    it('should return book', async () => {
      // Arrange
      bookRepository.findOneOrFail.resolves(fullBook);

      // Act
      const book: Book = await bookService.findOne(1);

      // Assert
      expect(book).to.be.eql(fullBook);
    });

    it('should throw error from repository', async () => {
      // Arrange
      bookRepository.findOneOrFail.rejects(new Error('Find error'));

      // Act
      const bookResponse: Promise<Book> = bookService.findOne(1);

      // Assert
      await expect(bookResponse).to.eventually.be.rejectedWith('Find error');
    });
  });

  describe('save', () => {
    it('should save book', async () => {
      // Arrange
      bookRepository.save.resolves(fullBook);

      // Act
      const savedBook: Book = await bookService.save(fullBook);

      // Assert
      expect(savedBook).to.be.eql(fullBook);
    });

    it('should throw error from repository', async () => {
      // Arrange
      bookRepository.save.rejects(new Error('Save error'));

      // Act
      const savedBookResponse: Promise<Book> = bookService.save(fullBook);

      // Assert
      await expect(savedBookResponse).to.eventually.be.rejectedWith('Save error');
    });
  });

  describe('update', () => {
    it('should update book with all optional properties', async () => {
      // Arrange
      const updateBookInput: UpdateBookInput = {
        author: 'UpdatedAuthor',
        title: 'UpdatedTitle',
        isPublished: false,
      };
      const updatedBook: Book = {
        ...book,
        ...updateBookInput,
      };

      bookRepository.findOneOrFail.resolves(book);
      bookRepository.save.resolves(updatedBook);

      // Act
      const savedBook: Book = await bookService.update(1, updateBookInput);

      // Assert
      expect(savedBook).to.be.eql(updatedBook);
      expect(bookRepository.save).to.be.calledWith(updatedBook);
    });

    it('should update book with no properties', async () => {
      // Arrange
      bookRepository.findOneOrFail.resolves(book);
      bookRepository.save.resolves(book);

      // Act
      const savedBook: Book = await bookService.update(1, {});

      // Assert
      expect(savedBook).to.be.eql(book);
      expect(bookRepository.save).to.be.calledWith(book);
    });

    it(`should throw error if book for update doesn't exists`, async () => {
      // Arrange
      bookRepository.findOneOrFail.rejects(new Error('Find error'));

      // Act
      const savedBookResponse: Promise<Book> = bookService.update(1, book);

      // Assert
      await expect(savedBookResponse).to.eventually.be.rejectedWith('Find error');
    });

    it('should throw error from save repository method', async () => {
      // Arrange
      bookRepository.findOneOrFail.resolves(book);
      bookRepository.save.rejects(new Error('Update error'));

      // Act
      const savedBookResponse: Promise<Book> = bookService.update(1, book);

      // Assert
      await expect(savedBookResponse).to.eventually.be.rejectedWith('Update error');
    });
  });

  describe('deleteById', () => {
    it('should delete book', async () => {
      // Arrange
      const deleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };

      bookRepository.delete.resolves(deleteResult);

      // Act
      const result: DeleteResult = await bookService.deleteById(1);

      // Assert
      expect(result).to.be.eql(deleteResult);
    });

    it('should throw error from repository', async () => {
      // Arrange
      bookRepository.delete.rejects(new Error('Delete error'));

      // Act
      const deleteResult: Promise<DeleteResult> = bookService.deleteById(1);

      // Assert
      await expect(deleteResult).to.eventually.be.rejectedWith('Delete error');
    });
  });
});
