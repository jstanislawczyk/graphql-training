import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class Book extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: string;

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
