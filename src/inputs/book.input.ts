import {InputType, Field} from 'type-graphql';
import {IsBoolean, IsString} from 'class-validator';

@InputType()
export class CreateBookInput {

  @Field()
  @IsString()
  public title: string;

  @Field()
  @IsString()
  public author: string;

  @Field()
  @IsBoolean()
  public isPublished: boolean;
}
