import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class Book {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  author?: string;

  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  isPublished: boolean;
}
