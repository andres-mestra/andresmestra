require('dotenv').config()
const Fastify = require('fastify')
const mercurius = require('mercurius')

const app = Fastify()
const PORT = process.env.PORT

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

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: 'playground',
  playgroundHeaders(window) {
    return {
      authorization: `bearer ${window.sessionStorage.getItem('token')}`,
    }
  },
})

app
  .listen(PORT)
  .then((address) => console.log(`server listening on ${address} 🚀`))
  .catch((error) => {
    console.log('Error starting server:', error)
    process.exit(1)
  })
