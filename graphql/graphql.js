const { prisma } = require('../database/config')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const typeDefs = require('../graphql/typesDefs')
const resolvers = require('../graphql/resolvers')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
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
  queryDepth: 4,
}
