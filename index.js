const Fastify = require('fastify')
const mercurius = require('mercurius')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const app = Fastify({
    logger: true
})

const schema = `
type Query {
  hola: String
}
`

const resolvers = {
    Query: {
    hola: async () => "Hello world fastity and graphql"
    }
}

app.register(mercurius, {
schema,
resolvers,
graphiql: 'playground',
playgroundHeaders (window) {
  return {
    authorization: `bearer ${window.sessionStorage.getItem('token')}`
  }
}
})


const start = async ( req, reply ) => {
    try {
        await app.listen(3000)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}


start()



