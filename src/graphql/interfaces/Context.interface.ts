import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';
import { User } from '@generated/type-graphql';

export interface AppContext extends ExpressContext {
  prisma: PrismaClient;
  user?: User;
}
