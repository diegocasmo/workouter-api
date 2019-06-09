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

server.listen()
  .then(({ url }) => {
    console.log(`Server listening on ${url}`)
  })
