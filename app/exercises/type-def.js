const { gql } = require('apollo-server')

const typeDef = gql`
  type Exercise {
    _id: ID!
    name: String!
    user_id: ID!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getExercise(exerciseId: ID!): Exercise
  }
`

module.exports = {
  typeDef
}
