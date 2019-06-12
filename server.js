require('dotenv').config()
require('./config/db')
const { ApolloServer, gql } = require('apollo-server')
const users = require('./app/users')

const typeDef = gql`
  type Query
`

const server = new ApolloServer({
  typeDefs: [typeDef, users.typeDef],
  resolvers: [users.resolvers],
  context: async ({ req }) => {
    let authToken = null
    let currentUser = null

    try {
      authToken = req.headers.authorization
      if (authToken) {
        currentUser = await users.services.findOrCreateAuthUser(authToken)
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`)
    }

    return { currentUser }
  }
})

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'
server.listen(port, host)
  .then(({ url }) => console.log(`Server listening on ${url}`))
  .catch((err) => console.error('Failed to start application', err))
