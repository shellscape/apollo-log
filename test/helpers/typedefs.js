const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    batman: String
  }
`;

module.exports = [typeDefs];
