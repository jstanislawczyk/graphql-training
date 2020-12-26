import {getRepository, Repository} from 'typeorm';
import {Book} from '../../../src/models/book';

export class BookUtils {

  public static async deleteAllBooks(): Promise<void> {
    this.getBookRepository().clear();
  }

  public static saveBook(book: Book): Promise<Book> {
    return this.getBookRepository().save(book);
  }

  public static saveBooksList(books: Book[]): Promise<Book[]> {
    return this.getBookRepository().save(books);
  }

  private static getBookRepository(): Repository<Book> {
    return getRepository(Book);
  }
}
