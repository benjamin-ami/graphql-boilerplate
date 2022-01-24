const getLevel = (levelCode) => {
  const levels = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'SILENT',
  ]
  return levels[levelCode];
}

export default {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    const { query, operationName } = requestContext.request;
    if (
      operationName === 'IntrospectionQuery' ||
      process.env.ENABLE_LOG !== 'true'
    ) return {};

    const logLevel = getLevel(requestContext.logger.getLevel());
    const user = requestContext.context.user || 'GUEST';

    console.log(`[${logLevel}] user: ${user.username} | query: ${query}`);
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log('Validation started!');
      },

    }
  },
};