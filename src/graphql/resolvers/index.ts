import { NonEmptyArray } from 'type-graphql';

import { resolvers } from '@generated/type-graphql';
import AuthenticationResolver from './Authentication.resolver';
import UserResolver from "./User.resolver";

export default [
  ...resolvers,
  AuthenticationResolver,
  UserResolver
] as NonEmptyArray<Function>;
