import {BookRepository} from '../repositories/book.repository';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {Book} from '../models/book';

export class BookService {

  constructor(
    @InjectRepository()
    private readonly bookRepository: BookRepository,
  ) {
  }

  public async getAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }
}
