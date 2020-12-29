import {Resolver, Query, Arg, Mutation} from 'type-graphql';
import {Service} from 'typedi';
import {Book} from '../models/book';
import {BookService} from '../services/book.service';
import {Logger} from '../common/logger';
import {CreateBookInput} from '../inputs/book.input';
import {UpdateBookInput} from '../inputs/update-book.input';
import {DeleteResult} from 'typeorm';

@Service()
@Resolver(() => Book)
export class BookResolver {

  constructor(private readonly bookService: BookService) {
  }

  @Query(() => [Book])
  public async getBooks(): Promise<Book[]> {
    Logger.log('Fetching all books');

    return await this.bookService.findAll();
  }

  @Query(() => Book)
  public async getBookById(@Arg('id') id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  public async createBook(@Arg('createBookInput') createBookInput: CreateBookInput): Promise<Book> {
    const book: Book = {
      author: createBookInput.author,
      title: createBookInput.title,
      isPublished: createBookInput.isPublished,
    };

    return await this.bookService.save(book);
  }

  @Mutation(() => Book)
  public async updateBook(
    @Arg('id') id: number,
    @Arg('updateBookInput') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return await this.bookService.update(id, updateBookInput);
  }

  @Mutation(() => Boolean)
  async deleteBookById(@Arg('id') id: number) {
    const deleteResult: DeleteResult = await this.bookService.deleteById(id);

    return deleteResult.affected === 1;
  }
}
