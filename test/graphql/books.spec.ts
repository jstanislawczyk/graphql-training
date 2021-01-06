import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {BookUtils} from '../utils/database-utils/book.utils';
import {Book} from '../../src/models/book';
import {book, fullBook} from '../fixtures/book.fixture';
import {expect} from 'chai';
import {CreateBookInput} from '../../src/inputs/book.input';

describe('Books', () => {

  beforeEach(async () => {
    await BookUtils.deleteAllBooks();
  });

  describe('getBooks', () => {
    it('should get empty books list', async () => {
      // Arrange
      const query: string = `
      {
        getBooks {
            id,
            title,
            author,
            isPublished
          }
        }
    `;

      // Act & Assert
      await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200, {
          data: {
            getBooks: [],
          },
        });
    });

    it('should get books list', async () => {
      // Arrange
      const query: string = `
      {
        getBooks {
            id,
            title,
            author,
            isPublished
          }
        }
    `;

      const savedBooks: Book[] = await BookUtils.saveBooksList([
        book, fullBook,
      ]);

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedBooks: Book[] = response.body.data.getBooks as Book[];

      expect(returnedBooks).to.have.length(2);
      expect(returnedBooks[0].id).to.be.eql(String(savedBooks[0].id));
      expect(returnedBooks[0].title).to.be.eql(savedBooks[0].title);
      expect(returnedBooks[0].author).to.be.eql(savedBooks[0].author);
      expect(returnedBooks[0].isPublished).to.be.eql(savedBooks[0].isPublished);

      expect(returnedBooks[1].id).to.be.eql(String(savedBooks[1].id));
      expect(returnedBooks[1].title).to.be.eql(savedBooks[1].title);
      expect(returnedBooks[1].author).to.be.eql(savedBooks[1].author);
      expect(returnedBooks[1].isPublished).to.be.eql(savedBooks[1].isPublished);
    });
  });

  describe('getBookById', () => {
    it('should not find book', async () => {
      // Arrange
      const query: string = `
        {
          getBookById(id: 1) {
            id,
            title,
            author,
            isPublished
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const error: Record<string, any> = response.body.errors[0];

      expect(error.path[0]).to.be.eql('getBookById');
      expect(error.message).to.be.a('string')
        .and.satisfy((message: string) =>
          message.startsWith('Could not find any entity of type "Book" matching')
        );
    });

    it('should get book', async () => {
      // Arrange
      const savedBook: Book = await BookUtils.saveBook(fullBook);
      const query: string = `
        {
          getBookById(id: ${savedBook.id}) {
            id,
            title,
            author,
            isPublished
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const returnedBook: Book = response.body.data.getBookById as Book;
      expect(returnedBook.id).to.be.eql(String(savedBook.id));
      expect(returnedBook.title).to.be.eql(savedBook.title);
      expect(returnedBook.author).to.be.eql(savedBook.author);
      expect(returnedBook.isPublished).to.be.eql(savedBook.isPublished);
    });
  });

  describe('saveBook', () => {
    it('should fail validation', async () => {
      // Arrange
      const createBookInput: CreateBookInput = {
        isPublished: true,
      } as CreateBookInput;

      const query: string = `
        mutation {
          saveBook (
            createBookInput: {
              isPublished: ${createBookInput.isPublished}
            }
          ) {
            id,
            author,
            title,
            isPublished
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(400);

      const savedBooks: Book[] = await BookUtils.getAllBooks();
      const returnedBook: Record<string, any>[] = response.body.errors;

      expect(savedBooks).to.have.length(0);
      expect(returnedBook[0].message).to.be.eql('Field "CreateBookInput.title" of required type "String!" was not provided.');
      expect(returnedBook[0].extensions.code).to.be.eql('GRAPHQL_VALIDATION_FAILED');
      expect(returnedBook[1].message).to.be.eql('Field "CreateBookInput.author" of required type "String!" was not provided.');
      expect(returnedBook[1].extensions.code).to.be.eql('GRAPHQL_VALIDATION_FAILED');
    });

    it('should save book', async () => {
      // Arrange
      const createBookInput: CreateBookInput = {
        title: 'test_title',
        author: 'test_author',
        isPublished: true,
      };

      const query: string = `
        mutation {
          saveBook (
            createBookInput: {
              title: "${createBookInput.title}",
              author: "${createBookInput.author}",
              isPublished: ${createBookInput.isPublished}
            }
          ) {
            id,
            author,
            title,
            isPublished
          }
        }
      `;

      // Act & Assert
      const response: Response = await request(application.serverInfo.url)
        .post('/graphql')
        .send({ query })
        .expect(200);

      const savedBooks: Book[] = await BookUtils.getAllBooks();
      const returnedBook: Book = response.body.data.saveBook as Book;

      expect(savedBooks).to.have.length(1);
      expect(returnedBook.id).to.be.eql(String(savedBooks[0].id));
      expect(returnedBook.title).to.be.eql(savedBooks[0].title);
      expect(returnedBook.author).to.be.eql(savedBooks[0].author);
      expect(returnedBook.isPublished).to.be.eql(savedBooks[0].isPublished);
    });
  });
});
