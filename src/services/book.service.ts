import {BookRepository} from '../repositories/book.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {Book} from '../models/book';
import {UpdateBookInput} from '../inputs/update-book.input';
import {DeleteResult} from 'typeorm';

export class BookService {

  constructor(
    @InjectRepository()
    private readonly bookRepository: BookRepository,
  ) {
  }

  public findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  public findOne(id: number): Promise<Book> {
    return this.bookRepository.findOneOrFail({
      id,
    });
  }

  public save(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  public async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    const existingBook: Book = await this.bookRepository.findOneOrFail({
      id,
    });

    if (updateBookInput.author !== undefined) {
      existingBook.author = updateBookInput.author;
    }

    if (updateBookInput.title !== undefined) {
      existingBook.title = updateBookInput.title;
    }

    if (updateBookInput.isPublished !== undefined) {
      existingBook.isPublished = updateBookInput.isPublished;
    }

    return this.bookRepository.save(existingBook);
  }

  public deleteById(id: number): Promise<DeleteResult> {
    return this.bookRepository.delete({
      id,
    });
  }
}
