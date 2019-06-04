const { ApolloServer } = require('apollo-server');

const { LogExtension } = require('../../lib/index');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const port = 55555;

const run = async (options) => {
  const extensions = [() => new LogExtension(options)];
  const apollo = new ApolloServer({
    extensions,
    resolvers,
    typeDefs
  });

  await apollo.listen({ port });

  return apollo;
};

module.exports = { run };
