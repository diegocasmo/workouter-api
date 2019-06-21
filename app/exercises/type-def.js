const { gql } = require('apollo-server')

const typeDef = gql`
  type Exercise {
    _id: ID!
    name: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getExercise(exerciseId: ID!): Exercise
  }

  extend type Mutation {
    createExercise(name: String!): Exercise
    updateExercise(exerciseId: ID!, name: String!): Exercise
  }
`

module.exports = {
  typeDef
}
