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
  playgroundHeaders(window) {
    return {
      authorization: `bearer ${window.sessionStorage.getItem('token')}`,
    }
  },
  context: (request, reply) => {
    return {
      userId: 1,
      db: prisma,
    }
  },
}
