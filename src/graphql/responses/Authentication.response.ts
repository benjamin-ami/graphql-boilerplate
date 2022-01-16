import { ObjectType, Field } from 'type-graphql';
import { User } from '@generated/type-graphql';

@ObjectType()
export class UserOutput extends User {
  @Field()
  token: string;

  @Field({ nullable: true })
  password: string;
}
