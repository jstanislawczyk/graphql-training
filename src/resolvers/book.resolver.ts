import {Resolver, Query} from 'type-graphql';
import {Service} from 'typedi';
import {Book} from '../models/book';
import {BookService} from '../services/book.service';

@Service()
@Resolver(() => Book)
export class BookResolver {

  constructor(private readonly bookService: BookService) {
  }

  @Query(() => [Book])
  public async books(): Promise<Book[]> {
    console.log('Fetching all books');

    return await this.bookService.getAll();
  }
}
