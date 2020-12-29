import request, {Response} from 'supertest';
import {application} from '../hooks/application-hook';
import {BookUtils} from '../utils/database-utils/book.utils';
import {Book} from '../../src/models/book';
import {book, fullBook} from '../fixtures/book.fixture';
import {expect} from 'chai';

describe('Books', () => {

  beforeEach(async () => {
    await BookUtils.deleteAllBooks();
  });

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

