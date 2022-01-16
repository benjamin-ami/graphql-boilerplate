import { NonEmptyArray } from 'type-graphql';

import { resolvers } from '@generated/type-graphql';
import AuthenticationResolver from './Authentication.resolver';

export default [...resolvers, AuthenticationResolver] as NonEmptyArray<Function>;
