import {getRepository, Repository} from 'typeorm';
import {Book} from '../../../src/models/book';

export class BookUtils {

  public static getAllBooks(): Promise<Book[]> {
    return this.getBookRepository().find();
  }

  public static getBookById(id: number): Promise<Book | undefined> {
    return this.getBookRepository().findOne({ id });
  }

  public static saveBook(book: Book): Promise<Book> {
    return this.getBookRepository().save(book);
  }

  public static saveBooksList(books: Book[]): Promise<Book[]> {
    return this.getBookRepository().save(books);
  }

  public static async deleteAllBooks(): Promise<void> {
    this.getBookRepository().clear();
  }

  private static getBookRepository(): Repository<Book> {
    return getRepository(Book);
  }
}
