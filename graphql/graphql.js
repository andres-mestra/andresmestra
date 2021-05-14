const { dbConection, prisma } = require('../database/config')

dbConection()

const schema = `
type Query {
  hola: String
}
`

const resolvers = {
  Query: {
    hola: async () => 'Hello world fastity and graphql',
  },
}

module.exports = {
  schema,
  resolvers,
  graphiql: 'playground',
  playgroundHeaders(window) {
    return {
      authorization: `bearer ${window.sessionStorage.getItem('token')}`,
    }
  },
}
