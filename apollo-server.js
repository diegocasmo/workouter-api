const { ApolloServer, gql } = require('apollo-server')
const users = require('./app/users')
const exercises = require('./app/exercises')

const typeDef = gql`
  type Query
`

const defaultContext = async ({ req }) => {
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

const constructServer = ({ context = defaultContext }) => {
  const server = new ApolloServer({
    typeDefs: [typeDef, users.typeDef, exercises.typeDef],
    resolvers: [users.resolvers, exercises.resolvers],
    context
  })

  return { server }
}

module.exports = {
  constructServer
}
