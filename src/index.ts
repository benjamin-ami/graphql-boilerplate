import 'reflect-metadata';
import apolloServer from './config/apollo';
import app from './config/app';

(async () => {
  const port = process.env.PORT || 4000;
  const server = await apolloServer();

  // remember to active cors
  server.applyMiddleware({ app, cors: false, path: '/' });

  app.listen({ port }, () => console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`));
})();
