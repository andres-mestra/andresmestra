const { prisma } = require('../database/config')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const typeDefs = require('../graphql/typesDefs')
const resolvers = require('../graphql/resolvers')
const { authDirectiveTransformer } = require('../auth/authDirectives')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaTransforms: [authDirectiveTransformer],
})

module.exports = {
  schema,
  graphiql: 'playground',
  context: (request, reply) => {
    return {
      db: prisma,
      headers: request.headers,
    }
  },
}
