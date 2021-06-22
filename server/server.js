const Fastify = require('fastify')
const mercurius = require('mercurius')
const CORS = require('fastify-cors')
const { dbConection } = require('../database/config')
const graphql = require('../graphql/graphql')

class Server {
  constructor() {
    this.app = Fastify()
    this.port = process.env.PORT || 3000

    dbConection()
  }

  register() {
    // prettier-ignore
    this.app.register(CORS, {
      origin: ['http://localhost:3001', /\:localhost\:3001$/],
      methods: ['GET','POST']
    })
    this.app.register(mercurius, graphql)
  }

  execute() {
    this.register()

    this.app
      .listen(this.port)
      .then((address) =>
        console.log(`server listening on ${address}/playground 🚀`)
      )
      .catch((error) => {
        console.log('Error starting server:', error)
        process.exit(1)
      })
  }
}

module.exports = Server
