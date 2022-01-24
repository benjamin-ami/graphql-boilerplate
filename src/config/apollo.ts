import * as tq from 'type-graphql';
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import resolvers from '../graphql/resolvers';
import permissions from '../graphql/security/rules';
import context from './context';
import logger from "../utils/logger";

export default async function () {
  const schema = await tq.buildSchema({ resolvers });

  const server = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
      logger
    ],
    validationRules: [
      depthLimit(process.env.DEPTH_LIMIT),
    ]
  });

  await server.start();

  return server;
}
