const { gql } = require('apollo-server')

const typeDef = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    me: User
  }
`

module.exports = {
  typeDef
}
