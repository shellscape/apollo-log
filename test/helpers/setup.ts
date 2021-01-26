import { ApolloServer } from 'apollo-server';

import { ApolloLogPlugin, LogOptions } from '../../src';

import { typeDefs } from './typedefs';
import { resolvers } from './resolvers';

const port = 55555;

export const run = async (options: Partial<LogOptions>) => {
  const plugins = [() => ApolloLogPlugin(options as LogOptions)];
  const apollo = new ApolloServer({
    plugins,
    resolvers,
    typeDefs
  });

  await apollo.listen({ port });

  return apollo;
};
