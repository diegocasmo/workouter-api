const { ApolloServer, gql } = require('apollo-server')
const users = require('./app/users')
const exercises = require('./app/exercises')

const typeDef = gql`
  type Query
  type Mutation
`

const defaultContext = async ({ req }) => {
  // Retrieve authorization token
  const authToken = req
    ? req.headers.authorization
    : null
  // Attempt to find user using the authorization token
  const currentUser = authToken
    ? await users.services.findOrCreateAuthUser(authToken)
    : null

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
