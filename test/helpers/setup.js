const { ApolloServer } = require('apollo-server');

const { ApolloLogExtension } = require('../../lib/index');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const port = 55555;

const run = async (options) => {
  const extensions = [() => new ApolloLogExtension(options)];
  const apollo = new ApolloServer({
    extensions,
    resolvers,
    typeDefs
  });

  await apollo.listen({ port });

  return apollo;
};

module.exports = { run };
