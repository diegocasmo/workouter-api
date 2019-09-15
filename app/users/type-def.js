const { gql } = require('apollo-server')

const typeDef = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    pictureUrl: String
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    currentUser: User
  }
`

module.exports = {
  typeDef,
}
