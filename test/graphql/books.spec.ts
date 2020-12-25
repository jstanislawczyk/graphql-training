import request from 'supertest';
import {Application} from '../../src/application';

describe('Books', () => {

  let application: Application = new Application();

  before(async () => {
    await application.bootstrap();
  });

  after(async () => {
    await application.close();
  });

  it('should get books', async () => {
    // Arrange
    const query: string = `
      {
        books {
            id,
            title,
            author,
            isPublished
          }
        }
    `;

    // Act & Assert
    const response = await request(application.serverInfo.url)
      .post('/graphql')
      .send({ query })
      .expect(200);

    console.log(response);
  });
});

