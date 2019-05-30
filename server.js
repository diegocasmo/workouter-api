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
})

server.listen()
  .then(({ url }) => {
    console.log(`Server listening on ${url}`)
  })
